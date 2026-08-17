export default function ReturnsRefundsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Returns & Refunds
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Please read our returns and exchange policy carefully before making
            a purchase.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-10 text-gray-700 leading-7">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Our Returns Policy
              </h2>

              <p>
                At Rocks Hairmpire, we aim to please our customers and ensure
                that you are completely satisfied with your order and
                experience. We maintain a high level of quality control to
                ensure that our customers receive nothing short of the finest
                quality hair products.
              </p>

              <p className="mt-4">
                Due to the nature of our products, all sales are final.
                <strong> Refunds are not allowed.</strong> However, exchanges
                may be accepted subject to the terms and conditions outlined
                below.
              </p>
            </section>

            {/* Exchange Eligibility */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Exchange Eligibility
              </h2>

              <p>
                If, for any reason, what was delivered to you isn't what you
                paid for or you are unhappy with your purchased product, we may
                agree to exchange the product for another product of equal
                value.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  The complaint must be made within{" "}
                  <strong>24 hours of receiving</strong> the order.
                </li>
                <li>The product must be returned unused and unaltered.</li>
                <li>
                  The product must be returned within <strong>3 days</strong>{" "}
                  after the recorded receipt of the item.
                </li>
                <li>
                  The returned product must pass our inspection before an
                  exchange can be approved.
                </li>
              </ul>
            </section>

            {/* Products That Cannot Be Exchanged */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Products That Cannot Be Exchanged
              </h2>

              <p>
                We will not accept exchanges for products that have been altered
                or used. This includes products where:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>The band holding the hair has been untied or cut off.</li>
                <li>
                  Curly weaves have been brushed out or altered in any way.
                </li>
                <li>The hair has been worn, washed, or styled.</li>
                <li>The hair or lace has been cut or altered.</li>
                <li>
                  Any glue, hair products, chemicals, oils, or other products
                  have been applied.
                </li>
              </ul>
            </section>

            {/* Lace Products */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Lace Closures, Frontals & Wigs
              </h2>

              <p>
                Lace closures, lace frontals, or wigs made from either will not
                be accepted for exchanges if they have been:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Bleached or tinted.</li>
                <li>Worn or installed.</li>
                <li>Styled or altered.</li>
                <li>Cut, including the lace or hair.</li>
                <li>Had glue, adhesive, or hair products applied.</li>
              </ul>

              <p className="mt-4">
                Due to the delicate nature of lace frontals which have been
                customized, we will not exchange used lace frontals that have
                been bleached or plucked as part of the customization process.
              </p>
            </section>

            {/* Return Shipping */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Returning Your Product
              </h2>

              <p>
                We recommend sending your return through a courier service that
                provides tracking information and delivery confirmation. Rocks
                Hairmpire is not responsible for packages that are lost while
                being returned.
              </p>

              <p className="mt-4">
                We must receive and inspect the product before an exchange can
                be processed.
              </p>
            </section>

            {/* Inspection */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Inspection & Exchange Approval
              </h2>

              <p>
                All returned products will be inspected before an exchange is
                approved. If any of the conditions stated in this policy are not
                met, Rocks Hairmpire reserves the right to refuse the exchange.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl bg-gray-50 p-6">
              <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                Need Help?
              </h2>

              <p>
                If you have an issue with your order or believe you received the
                wrong product, please contact our customer service team within
                24 hours of receiving your order.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
