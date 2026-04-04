const pool = require("../utils/db");

async function createCoupon(payload) {
  console.log("DB: createCoupon called with payload:", payload);
  try {
    const [result] = await pool.query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_uses, expiry_date, is_active, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.code,
        payload.discount_type,
        payload.discount_value,
        payload.min_purchase || 0,
        payload.max_uses || null,
        payload.expiry_date || null,
        payload.is_active !== false ? 1 : 0,
        payload.description || null,
      ]
    );
    console.log("DB: createCoupon success, insertId:", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("DB: createCoupon error:", error.message);
    throw error;
  }
}

async function getCoupons() {
  console.log("DB: getCoupons called");
  try {
    const [rows] = await pool.query(
      `SELECT * FROM coupons WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );
    console.log("DB: getCoupons found", rows.length, "rows");
    return rows;
  } catch (error) {
    console.error("DB: getCoupons error:", error.message);
    throw error;
  }
}

async function getCouponById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM coupons WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function getCouponByCode(code) {
  const [rows] = await pool.query(
    `SELECT * FROM coupons WHERE code = ? AND deleted_at IS NULL AND is_active = 1 LIMIT 1`,
    [code]
  );
  return rows[0] || null;
}

async function validateCoupon(code, totalPrice) {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { valid: false, message: "Coupon code not found or inactive" };
  }

  // Check expiry date
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { valid: false, message: "Coupon has expired" };
  }

  // Check max uses
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  // Check minimum purchase
  if (coupon.min_purchase && totalPrice < coupon.min_purchase) {
    return {
      valid: false,
      message: `Minimum purchase amount is ${coupon.min_purchase}`,
    };
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discount_type === "percentage") {
    discountAmount = Math.floor((totalPrice * coupon.discount_value) / 100);
  } else if (coupon.discount_type === "fixed") {
    discountAmount = coupon.discount_value;
  }

  return {
    valid: true,
    coupon: coupon,
    discountAmount: discountAmount,
    finalPrice: Math.max(0, totalPrice - discountAmount),
  };
}

async function updateCouponById(id, payload) {
  const [result] = await pool.query(
    `UPDATE coupons 
     SET code = ?, discount_type = ?, discount_value = ?, min_purchase = ?, 
         max_uses = ?, expiry_date = ?, is_active = ?, description = ?
     WHERE id = ?`,
    [
      payload.code,
      payload.discount_type,
      payload.discount_value,
      payload.min_purchase || 0,
      payload.max_uses || null,
      payload.expiry_date || null,
      payload.is_active !== false ? 1 : 0,
      payload.description || null,
      id,
    ]
  );
  return result.affectedRows > 0;
}

async function incrementCouponUsage(couponId) {
  const [result] = await pool.query(
    `UPDATE coupons SET used_count = used_count + 1 WHERE id = ?`,
    [couponId]
  );
  return result.affectedRows > 0;
}

async function deleteCouponById(id) {
  const [result] = await pool.query(
    `UPDATE coupons SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  getCouponByCode,
  validateCoupon,
  updateCouponById,
  incrementCouponUsage,
  deleteCouponById,
};