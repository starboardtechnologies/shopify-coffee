import {useEffect, useState, type ChangeEvent} from "react";
import {Link} from "react-router";

import {useCart} from "~/components/cart/CartContext";

/* ==================================================
   Form Types
================================================== */

type CheckoutFormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type FormErrors = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

type OrderConfirmation = {
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: ReturnType<typeof useCart>["cartItems"];
  total: number;
};

/* ==================================================
   Storage Keys
================================================== */

const ORDER_STORAGE_KEY = "java-order-confirmation-v1";

const CHECKOUT_FORM_STORAGE_KEY = "java-checkout-form-v1";

/* ==================================================
   Empty Form
================================================== */

const EMPTY_FORM: CheckoutFormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

/* ==================================================
   Checkout Page
================================================== */

export default function CheckoutPage() {
  const {cartItems, clearCart} = useCart();

  /* ==================================================
     State
  ================================================== */

  const [isProcessing, setIsProcessing] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  /*
   * Load previously entered checkout information.
   */
  const [formData, setFormData] = useState<CheckoutFormData>(() => {
    if (typeof window === "undefined") {
      return EMPTY_FORM;
    }

    try {
      const savedForm = sessionStorage.getItem(
        CHECKOUT_FORM_STORAGE_KEY,
      );

      if (!savedForm) {
        return EMPTY_FORM;
      }

      /*
       * JSON.parse returns an unknown object.
       * Explicitly tell TypeScript what shape
       * we expect from our own saved data.
       */
      const parsedForm = JSON.parse(
        savedForm,
      ) as Partial<CheckoutFormData>;

      return {
        ...EMPTY_FORM,
        ...parsedForm,
      };
    } catch (error) {
      console.error(
        "Failed to load Java checkout form:",
        error,
      );

      sessionStorage.removeItem(
        CHECKOUT_FORM_STORAGE_KEY,
      );

      return EMPTY_FORM;
    }
  });

  /*
   * Load previously completed order.
   */
  const [order, setOrder] =
    useState<OrderConfirmation | null>(() => {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const savedOrder = sessionStorage.getItem(
          ORDER_STORAGE_KEY,
        );

        if (!savedOrder) {
          return null;
        }

        return JSON.parse(
          savedOrder,
        ) as OrderConfirmation;
      } catch (error) {
        console.error(
          "Failed to load Java order:",
          error,
        );

        sessionStorage.removeItem(
          ORDER_STORAGE_KEY,
        );

        return null;
      }
    });

  /* ==================================================
     Persist Checkout Form
  ================================================== */

  useEffect(() => {
    try {
      sessionStorage.setItem(
        CHECKOUT_FORM_STORAGE_KEY,
        JSON.stringify(formData),
      );
    } catch (error) {
      console.error(
        "Failed to save Java checkout form:",
        error,
      );
    }
  }, [formData]);

  /* ==================================================
     Form Change Handler
  ================================================== */

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const {name, value} = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    /*
     * Remove the error for this field when
     * the customer starts correcting it.
     */
    if (errors[name as keyof FormErrors]) {
      setErrors((current) => {
        const updated = {...current};

        delete updated[name as keyof FormErrors];

        return updated;
      });
    }
  }

  /* ==================================================
     Calculate Totals
  ================================================== */

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace("$", "")) *
        item.quantity,
    0,
  );

  const itemCount = cartItems.reduce(
    (sum, item) =>
      sum + item.quantity,
    0,
  );

  /* ==================================================
     Form Validation
  ================================================== */

  function validateForm() {
    const newErrors: FormErrors = {};

    /*
     * Email
     */
    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    /*
     * First Name
     */
    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    /*
     * Last Name
     */
    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    /*
     * Address
     */
    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required.";
    }

    /*
     * City
     */
    if (!formData.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    /*
     * Postal Code
     */
    if (!formData.postalCode.trim()) {
      newErrors.postalCode =
        "Postal code is required.";
    }

    /*
     * Country
     */
    if (!formData.country) {
      newErrors.country =
        "Please select a country.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* ==================================================
     Submit Order
  ================================================== */

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    /*
     * Simulate a real checkout request.
     */
    setTimeout(() => {
      const orderNumber =
        `JAVA-${Date.now()
          .toString()
          .slice(-8)}`;

      /*
       * formData is already typed as
       * CheckoutFormData, so every property
       * is guaranteed to exist.
       */
      const newOrder: OrderConfirmation = {
        orderNumber,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        items: cartItems,
        total,
      };

      /*
       * Save completed order.
       */
      sessionStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(newOrder),
      );

      /*
       * Show confirmation immediately.
       */
      setOrder(newOrder);

      /*
       * Empty cart.
       */
      clearCart();

      /*
       * Clear saved checkout form.
       */
      sessionStorage.removeItem(
        CHECKOUT_FORM_STORAGE_KEY,
      );

      setFormData(EMPTY_FORM);

      setIsProcessing(false);
    }, 1200);
  }

  /* ==================================================
     Order Confirmation
  ================================================== */

  if (order) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">

          <section className="checkout-success">

            <span className="checkout-eyebrow">
              JAVA
            </span>

            <div className="checkout-success-icon">
              ✓
            </div>

            <h1>
              Order Confirmed
            </h1>

            <p>
              Thank you,{" "}
              {order.firstName}.
              Your coffee order has been
              received.
            </p>

            <p className="checkout-order-number">
              Order #{order.orderNumber}
            </p>

            <p className="checkout-demo-note">
              This is a portfolio demo
              checkout. No payment was
              processed.
            </p>

          </section>

          <div className="checkout-confirmation">

            {/* ORDER DETAILS */}

            <section className="checkout-confirmation-section">

              <h2>
                Order Details
              </h2>

              <div className="checkout-summary-row">

                <span>
                  Order number
                </span>

                <strong>
                  #{order.orderNumber}
                </strong>

              </div>

              <div className="checkout-summary-row">

                <span>
                  Email
                </span>

                <span>
                  {order.email}
                </span>

              </div>

              <div className="checkout-summary-row">

                <span>
                  Status
                </span>

                <span>
                  Demo Order
                </span>

              </div>

            </section>

            {/* ITEMS */}

            <section className="checkout-confirmation-section">

              <h2>
                Your Coffee
              </h2>

              <div className="checkout-products">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="checkout-product"
                  >

                    <div className="checkout-product-image">

                      <img
                        src={item.image}
                        alt={item.title}
                      />

                      <span>
                        {item.quantity}
                      </span>

                    </div>

                    <div>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.origin}
                      </p>

                    </div>

                    <strong>
                      $
                      {(
                        Number(
                          item.price.replace(
                            "$",
                            "",
                          ),
                        ) *
                        item.quantity
                      ).toFixed(2)}
                    </strong>

                  </div>
                ))}

              </div>

              <div className="checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  ${order.total.toFixed(2)}
                </strong>

              </div>

            </section>

            {/* SHIPPING */}

            <section className="checkout-confirmation-section">

              <h2>
                Shipping Address
              </h2>

              <p>
                {order.firstName}{" "}
                {order.lastName}

                <br />

                {order.address}

                <br />

                {order.city},{" "}
                {order.postalCode}

                <br />

                {order.country}
              </p>

            </section>

          </div>

          <div className="checkout-confirmation-actions">

            <Link
              to="/collections"
              className="checkout-button"
              onClick={() => {
                sessionStorage.removeItem(
                  ORDER_STORAGE_KEY,
                );
              }}
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="continue-shopping"
              onClick={() => {
                sessionStorage.removeItem(
                  ORDER_STORAGE_KEY,
                );
              }}
            >
              ← Back to Java
            </Link>

          </div>

        </div>
      </main>
    );
  }

  /* ==================================================
     Empty Cart
  ================================================== */

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">

        <section className="checkout-empty">

          <span className="checkout-eyebrow">
            JAVA
          </span>

          <h1>
            Your Cart Is Empty
          </h1>

          <p>
            Add some coffee before
            checking out.
          </p>

          <Link
            to="/collections"
            className="checkout-button"
          >
            Shop Coffee
          </Link>

        </section>

      </main>
    );
  }

  /* ==================================================
     Checkout
  ================================================== */

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* HEADER */}

        <header className="checkout-header">

          <Link
            to="/"
            className="checkout-brand"
          >
            Java
          </Link>

          <span>
            Checkout
          </span>

        </header>

        <div className="checkout-layout">

          {/* FORM */}

          <form
            className="checkout-form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >

            {/* CONTACT */}

            <div className="checkout-section">

              <h2>
                Contact Information
              </h2>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                aria-invalid={!!errors.email}
              />

              {errors.email && (
                <p className="checkout-error">
                  {errors.email}
                </p>
              )}

            </div>

            {/* SHIPPING */}

            <div className="checkout-section">

              <h2>
                Shipping Address
              </h2>

              <div className="checkout-row">

                <div className="checkout-field">

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    aria-invalid={
                      !!errors.firstName
                    }
                  />

                  {errors.firstName && (
                    <p className="checkout-error">
                      {errors.firstName}
                    </p>
                  )}

                </div>

                <div className="checkout-field">

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    aria-invalid={
                      !!errors.lastName
                    }
                  />

                  {errors.lastName && (
                    <p className="checkout-error">
                      {errors.lastName}
                    </p>
                  )}

                </div>

              </div>

              <div className="checkout-field">

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  aria-invalid={
                    !!errors.address
                  }
                />

                {errors.address && (
                  <p className="checkout-error">
                    {errors.address}
                  </p>
                )}

              </div>

              <div className="checkout-row">

                <div className="checkout-field">

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    aria-invalid={!!errors.city}
                  />

                  {errors.city && (
                    <p className="checkout-error">
                      {errors.city}
                    </p>
                  )}

                </div>

                <div className="checkout-field">

                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    aria-invalid={
                      !!errors.postalCode
                    }
                  />

                  {errors.postalCode && (
                    <p className="checkout-error">
                      {errors.postalCode}
                    </p>
                  )}

                </div>

              </div>

              <div className="checkout-field">

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  aria-invalid={!!errors.country}
                >

                  <option
                    value=""
                    disabled
                  >
                    Country
                  </option>

                  <option value="US">
                    United States
                  </option>

                  <option value="CA">
                    Canada
                  </option>

                  <option value="NL">
                    Netherlands
                  </option>

                  <option value="GB">
                    United Kingdom
                  </option>

                </select>

                {errors.country && (
                  <p className="checkout-error">
                    {errors.country}
                  </p>
                )}

              </div>

            </div>

            {/* PAYMENT */}

            <div className="checkout-section">

              <h2>
                Payment
              </h2>

              <div className="demo-payment">

                <span>
                  Demo Payment
                </span>

                <p>
                  No real payment will
                  be processed.
                </p>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="checkout-button"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing Order..."
                : "Place Demo Order"}
            </button>

            <Link
              to="/cart"
              className="continue-shopping"
            >
              ← Back to Cart
            </Link>

          </form>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-products">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="checkout-product"
                >

                  <div className="checkout-product-image">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <span>
                      {item.quantity}
                    </span>

                  </div>

                  <div>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.origin}
                    </p>

                  </div>

                  <strong>
                    $
                    {(
                      Number(
                        item.price.replace(
                          "$",
                          "",
                        ),
                      ) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-summary-row">

              <span>
                Items
              </span>

              <span>
                {itemCount}
              </span>

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

            <div className="checkout-summary-row">

              <span>
                Shipping
              </span>

              <span>
                Calculated at checkout
              </span>

            </div>

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}