import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Customer Information
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shipping Policy
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Please review our shipping information below to understand how
            orders are processed, dispatched, and delivered.
          </p>
        </div>

        <div className="space-y-10">
          {/* Shipping Cost */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              How Much Does Shipping Cost?
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Shipping prices vary by state.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Shipping charges are calculated at checkout before payment is
              completed.
            </p>
          </section>

          {/* When will my order be shipped */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              When Will My Order Be Shipped?
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Order processing time is separate from shipping time.
            </p>

            <div className="mt-4 space-y-3">
              <p className="leading-7 text-gray-600">
                <span className="font-medium text-gray-900">
                  Processing Time:
                </span>{" "}
                3–5 business days (Monday to Friday), depending on order volume.
              </p>

              <p className="leading-7 text-gray-600">
                <span className="font-medium text-gray-900">
                  Shipping Time:
                </span>{" "}
                3–7 business days (Monday to Friday).
              </p>
            </div>

            <p className="mt-4 leading-7 text-gray-600">
              You will receive a confirmation email once your order has been
              processed and shipped.
            </p>
          </section>

          {/* Shipping Confirmation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              When Will I Know My Order Has Been Shipped?
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              As soon as your order has been dispatched, we&apos;ll send you a
              shipping confirmation email.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              If you do not receive your confirmation email by the stipulated
              processing period, please contact our customer support team.
            </p>
          </section>

          {/* Delivery Time */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              How Long Will It Take to Receive My Order?
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Most orders within Nigeria are delivered within 3 business days
              after dispatch.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Deliveries are typically made Monday to Friday, although some
              couriers may deliver on Saturdays depending on your location.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Please note that delivery times may vary during peak seasons or
              due to unforeseen courier delays.
            </p>
          </section>

          {/* Address */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Please Ensure Your Delivery Address Is Correct
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Before completing your order, please double-check that your
              shipping information is accurate, including:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-600">
              <li>House number and street name</li>
              <li>Flat or apartment number (if applicable)</li>
              <li>Town or city</li>
              <li>County (if applicable)</li>
              <li>Postcode</li>
              <li>Phone number</li>
            </ul>

            <p className="mt-5 leading-7 text-gray-600">
              We cannot accept responsibility for parcels delivered to an
              incorrect address if the information provided during checkout is
              inaccurate.
            </p>
          </section>
        </div>

        {/* Back to shop */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-900 transition hover:text-gray-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
