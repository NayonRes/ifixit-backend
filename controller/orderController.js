const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const orderModel = require("../db/models/orderModel");
const productModel = require("../db/models/productModel");
const jwt = require("jsonwebtoken");
const filterHelper = require("../helpers/filterHelper");
const responseBuilder = require("../builder/responseBuilder");

const index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  console.log("===========req.query.page", req.query.page);
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let query = filterHelper(req)

  let totalData = await orderModel.countDocuments(query);
  console.log("totalData=================================", totalData);
  const data = await orderModel
    .find(query)
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit);
  console.log("data", data);
  responseBuilder(res, 200, 'Success', data, {
    totalData: totalData,
    pageNo: page,
    limit: limit
  })
});

const show = catchAsyncError(async (req, res, next) => {
  let data = await orderModel.findById(req.params.id);
  if (!data) {
    return next(new ErrorHandler("No data found", 404));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

// this function is for managing cancel or update any product quantity
const fnProductsStockIncrease = async (cancelProductsOfOldOrderList) => {
  console.log(
    "cancelProductsOfOldOrderList 2222222222222",
    cancelProductsOfOldOrderList
  );

  let products = [];
  console.log("productIds==========");
  let productIds = [];
  if (cancelProductsOfOldOrderList.length > 0) {
    productIds = cancelProductsOfOldOrderList.map((item) =>
      item.product_id.toString()
    );
  }
  console.log("productIds", productIds);

  if (productIds.length > 0) {
    products = await productModel.find({
      product_id: { $in: productIds },
    });
  }
  console.log(
    "--------------------products---------------------------",
    products
  );
  let quantityUpdatedProduct = cancelProductsOfOldOrderList.map((item, i) => {
    let dbProduct = products.find((res) => res.product_id === item.product_id);
    dbProduct.stock_unit =
      parseInt(dbProduct.stock_unit) + parseInt(item.quantity);
    console.log(
      "====================================dbProduct 111111111111===================",
      i,
      dbProduct
    );

    return dbProduct;
  });

  console.log(
    "=========================quantityUpdatedProduct ===========================",
    quantityUpdatedProduct
  );

  if (quantityUpdatedProduct.length > 0) {
    const promises = quantityUpdatedProduct.map(
      (item) =>
        productModel.findByIdAndUpdate(
          item._id,
          { stock_unit: item.stock_unit },
          {
            new: true,
            runValidators: true,
            useFindAndModified: false,
          }
        )
      // productModel.findByIdAndUpdate(item._id, item, {
      //   new: true,
      //   runValidators: true,
      //   useFindAndModified: false,
      // })
    );
    // console.log("promises", promises);
    let result = await Promise.all(promises);
    console.log(
      "11111111111111111111111111111111 result 111111111111111111111111111111111111111",
      result
    );
    return result;
  }
};
const updateOrderProduct = async (orderList, res, next) => {
  let isProductStockUpdateSuccess = true;
  let productWithQuantity = [];
  console.log("orderList", orderList);
  let productIds = orderList.map((item) => item.product_id.toString());
  // console.log("productIds", productIds);

  if (productIds.length > 0) {
    let products = await productModel.find({
      product_id: { $in: productIds },
    });

    // console.log("products", products);
    if (products.length > 0) {
      // checking the product stock. if it is less than stock .then returning those products
      let unavailableProducts = [];
      orderList.map((item) => {
        let dbProduct = products.find(
          (res) => res.product_id === item.product_id
        );
        console.log("=================dbProduct==================", dbProduct);
        // console.log(
        //   "parseInt(dbProduct.stock_unit) - parseInt(item.quantity)",
        //   parseInt(dbProduct.stock_unit),
        //   parseInt(item.quantity)
        // );
        if (parseInt(dbProduct.stock_unit) - parseInt(item.quantity) < 0) {
          // item.stock_unit = dbProduct.stock_unit;
          unavailableProducts.push(item);
        }
      });
      console.log("unavailableProducts", unavailableProducts);
      if (unavailableProducts.length > 0) {
        return { isProductStockUpdateSuccess: false, unavailableProducts };
      } else {
        let quantityUpdatedProduct = orderList.map((item) => {
          let dbProduct = products.find(
            (res) => res.product_id === item.product_id
          );
          dbProduct.stock_unit =
            parseInt(dbProduct.stock_unit) - parseInt(item.quantity);
          //productWithQuantity array is for get the db data and using for create order product list only. For update data function it is not using
          productWithQuantity.push({
            ...dbProduct._doc,
            quantity: item.quantity,
            filter_data: item.filter_data,
          });
          console.log("dbProduct", dbProduct);
          return dbProduct;
        });
        if (quantityUpdatedProduct.length > 0) {
          const promises = quantityUpdatedProduct.map((item) =>
            productModel.findByIdAndUpdate(item._id, item, {
              new: true,
              runValidators: true,
              useFindAndModified: false,
            })
          );
          let result = await Promise.all(promises);
          console.log("result", result);
        }
        console.log("quantityUpdatedProduct", quantityUpdatedProduct);
        return { isProductStockUpdateSuccess: true, productWithQuantity };
      }
    }
  }
  // else {
  //   next(new ErrorHandler("Product stock update problem", 404));
  // }
};

const store = catchAsyncError(async (req, res, next) => {
  // checking product stock in every order item ----------------------------
  const { token } = req.cookies;
  let productHasNoQuantity = [];
  for (let index = 0; index < req.body.order_list.length; index++) {
    const element = req.body.order_list[index];
    if (element.quantity < 1) {
      productHasNoQuantity.push(element);
    }
  }
  if (productHasNoQuantity.length > 0) {
    return res.status(400).json({
      message: "Please enter all products quantity",
      data: productHasNoQuantity,
    });
  }
  let productWithQuantity = [];
  // updating product stock unit ----------------------------
  if (req.body.order_list.length > 0) {
    updateOrderProductResult = await updateOrderProduct(
      req.body.order_list,
      res,
      next
    );
    if (updateOrderProductResult.isProductStockUpdateSuccess) {
      productWithQuantity = updateOrderProductResult.productWithQuantity;
    } else {
      let productNames = updateOrderProductResult.unavailableProducts.map(
        (item) => item.name
      );
      console.log("productNames", productNames.toString());

      return res.status(400).json({
        success: false,
        message: `${productNames.toString()} requested stock is not available`,
        data: updateOrderProductResult.unavailableProducts,
      });
    }
    console.log("productWithQuantity", productWithQuantity);
  }
  // updating product stock unit ----------------------------end
  // console.log("req.body", req.body);

  let newIdserial;
  let newIdNo;
  let newId;
  const lastDoc = await orderModel.find().sort({ _id: -1 });
  if (lastDoc.length > 0) {
    newIdserial = lastDoc[0].order_id.slice(0, 3);
    newIdNo = parseInt(lastDoc[0].order_id.slice(3)) + 1;
    newId = newIdserial.concat(newIdNo);
    console.log("newIdserial", newIdserial);
    console.log("newIdNo", newIdNo);
  } else {
    newId = "ODR100001";
  }
  console.log("newId========================", newId);
  // create entry of order list
  let productDetails = [];
  let total_amount = 0;
  productWithQuantity.map((item) => {
    if (parseInt(item.discount_price) > 0) {
      total_amount += item.quantity * item.discount_price;
    } else {
      total_amount += item.quantity * item.price;
    }
    productDetails.push({
      product_id: item.product_id,
      images: item.images,
      name: item.name,
      filter_data: item.filter_data,
      quantity: item.quantity,
      price: item.price,
      discount_price: item.discount_price,
    });
  });
  console.log(
    "-----------------------------productDetails---------------------------",
    productDetails
  );
  let newTotal = total_amount - parseInt(req.body.discount);
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    order_id: newId,
    customer_name: req.body.customer_name,
    customer_address: req.body.customer_address,
    customer_email: req.body.customer_email,
    customer_phone: req.body.customer_phone,
    product_details: productDetails,
    discount: req.body.discount,
    tax: req.body.tax,
    payment_method: req.body.payment_method,
    transaction_type: req.body.transaction_type,
    transaction_id: req.body.transaction_id,
    paid_amount: req.body.paid_amount,
    total_amount: newTotal + (newTotal * parseInt(req.body.tax)) / 100,
    shipping_address: req.body.shipping_address,
    created_by: decodedData?.user?.email,
  };

  console.log("newData------------------------------------------", newData);
  console.log(
    "total_amount------------------------------------------",
    total_amount,
    newTotal
  );
 
  const data = await orderModel.create(newData);
  res.status(201).json({ message: "success", data: data });
});

const update = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  let data = await orderModel.findById(req.params.id);
  console.log(
    "updateData data ===========================================",
    data
  );
  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }

  let decreasedQuantityProducts = [];
  let increasedQuantityProducts = [];
  let cancelProductsOfOldOrderList = [];
  data?.product_details.map((DBOrderListProduct) => {
    let newOrderListProduct = req.body.order_list.find(
      (res) => res.product_id === DBOrderListProduct.product_id
    );
    console.log("newOrderListProduct-----------", newOrderListProduct);

    if (newOrderListProduct === undefined) {
      console.log("---------------if3----------------");
      cancelProductsOfOldOrderList.push(DBOrderListProduct);
    } else if (
      parseInt(newOrderListProduct.quantity) <
      parseInt(DBOrderListProduct.quantity)
    ) {
      console.log("---------------if1----------------");

      (DBOrderListProduct.quantity =
        parseInt(DBOrderListProduct.quantity) -
        parseInt(newOrderListProduct.quantity)),
        decreasedQuantityProducts.push(DBOrderListProduct);
    } else if (
      parseInt(newOrderListProduct.quantity) >
      parseInt(DBOrderListProduct.quantity)
    ) {
      console.log("---------------if2----------------");
      (DBOrderListProduct.quantity =
        parseInt(newOrderListProduct.quantity) -
        parseInt(DBOrderListProduct.quantity)),
        increasedQuantityProducts.push(DBOrderListProduct);
    }
  });

  if (increasedQuantityProducts.length > 0) {
    // updating product stock unit ----------------------------start
    let updateOrderProductResult = await updateOrderProduct(
      increasedQuantityProducts,
      res,
      next
    );
    if (updateOrderProductResult.isProductStockUpdateSuccess) {
      productWithQuantity = updateOrderProductResult.productWithQuantity;
    } else {
      let productNames = updateOrderProductResult.unavailableProducts.map(
        (item) => item.name
      );

      return res.status(400).json({
        success: false,
        message: `${productNames.toString()} requested stock is not available`,
        data: updateOrderProductResult.unavailableProducts,
      });
    }
    console.log("--------------------------run--------------------");
  }

  if (
    cancelProductsOfOldOrderList.length > 0 ||
    decreasedQuantityProducts.length > 0
  ) {
    // updating cancel product stock unit ----------------------------
    let cancelProductsStockManage = await fnProductsStockIncrease(
      cancelProductsOfOldOrderList.concat(decreasedQuantityProducts)
    );
  }

  // create entry of order list

  let productIds = req.body.order_list.map((item) =>
    item.product_id.toString()
  );
  console.log(
    "======================productIds 222222222====================",
    productIds
  );
  // let productWithQuantityOfDB = [];
  // if (productIds.length > 0) {
  //   let products = await productModel.find({
  //     product_id: { $in: productIds },
  //   });

  //   req.body.order_list.map((item) => {
  //     let dbProduct = products.find(
  //       (res) => res.product_id === item.product_id
  //     );
  //     console.log("5555555555555555555 dbProduct 55555555555555555", {
  //       ...dbProduct,
  //       quantity: item.quantity,
  //     });
  //     productWithQuantityOfDB.push({
  //       ...dbProduct._doc,
  //       quantity: item.quantity,
  //       filter_data: item.filter_data,
  //       price: item.price, // keeping the previous price
  //       discount_price: item.discount_price, // keeping the previous discount price
  //     });
  //     console.log("dbProduct", dbProduct);
  //     // return dbProduct;
  //   });
  // }

  let productDetails = [];
  let total_amount = 0;
  req.body.order_list.map((item) => {
    if (parseInt(item.discount_price) > 0) {
      total_amount += item.quantity * item.discount_price;
    } else {
      total_amount += item.quantity * item.price;
    }
    productDetails.push({
      product_id: item.product_id,
      images: item.images,
      name: item.name,
      filter_data: item.filter_data,
      quantity: item.quantity,
      price: item.price,
      discount_price: item.discount_price,
    });
  });
  console.log(
    "-----------------------------productDetails---------------------------",
    productDetails
  );
  let newTotal = total_amount - parseInt(req.body.discount);
  let decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let newData = {
    order_id: data.order_id,
    customer_name: req.body.customer_name,
    customer_address: req.body.customer_address,
    customer_email: req.body.customer_email,
    customer_phone: req.body.customer_phone,
    product_details: productDetails,
    discount: req.body.discount,
    tax: req.body.tax,
    payment_method: req.body.payment_method,
    transaction_type: req.body.transaction_type,
    transaction_id: req.body.transaction_id,
    paid_amount: req.body.paid_amount,
    total_amount: newTotal + (newTotal * parseInt(req.body.tax)) / 100,
    shipping_address: req.body.shipping_address,
    updated_by: decodedData?.user?.email,
    updated_at: new Date(),
  };

  console.log("newData------------------------------------------", newData);

  data = await orderModel.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModified: false,
  });

  res.status(200).json({
    success: true,
    message: "Update successfully",
    data: data,
  });
});

const remove = catchAsyncError(async (req, res, next) => {
  console.log("deleteData function is working");
  let data = await orderModel.findById(req.params.id);
  console.log("data", data);
  if (!data) {
    console.log("if");
    return next(new ErrorHandler("No data found", 404));
  }

  await data.remove();
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    data: data,
  });
});


module.exports = {
  index,
  show,
  store,
  update,
  remove
};
