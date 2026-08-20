import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Terms of Service
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Please read these terms carefully before using our website or
            purchasing from Rocks Hairmpire.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-10 text-gray-700 leading-7">
            {/* Overview */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Overview
              </h2>

              <p>
                This website is operated by Rocks Hairmpire. Throughout the
                site, the terms “we”, “us” and “our” refer to Rocks Hairmpire.
                Rocks Hairmpire offers this website, including all information,
                tools and services available from this site to you, the user,
                conditioned upon your acceptance of all terms, conditions,
                policies and notices stated here.
              </p>

              <p className="mt-4">
                By visiting our site and/or purchasing something from us, you
                engage in our “Service” and agree to be bound by these Terms of
                Service, including any additional terms, conditions and policies
                referenced herein or available by hyperlink.
              </p>

              <p className="mt-4">
                These Terms of Service apply to all users of the site, including
                browsers, vendors, customers, merchants and contributors of
                content.
              </p>

              <p className="mt-4">
                Please read these Terms of Service carefully before accessing or
                using our website. If you do not agree to all the terms and
                conditions of this agreement, you may not access the website or
                use our services.
              </p>
            </section>

            {/* Updates */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Changes to Our Terms
              </h2>

              <p>
                Any new features or tools added to the store shall also be
                subject to these Terms of Service. We reserve the right to
                update, change or replace any part of these Terms by posting
                updates or changes to our website.
              </p>

              <p className="mt-4">
                It is your responsibility to check this page periodically for
                changes. Your continued use of or access to the website after
                changes have been posted constitutes acceptance of those
                changes.
              </p>
            </section>

            {/* Online Store */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                1. Online Store Terms
              </h2>

              <p>
                By agreeing to these Terms of Service, you represent that you
                are at least the age of majority in your state or province of
                residence, or that you are the age of majority and have given
                consent for any minor dependents to use this site.
              </p>

              <p className="mt-4">
                You may not use our products for any illegal or unauthorized
                purpose. You must not violate any laws in your jurisdiction,
                including copyright laws.
              </p>

              <p className="mt-4">
                You must not transmit worms, viruses or any code of a
                destructive nature. A breach or violation of these Terms may
                result in immediate termination of your Services.
              </p>
            </section>

            {/* General Conditions */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                2. General Conditions
              </h2>

              <p>
                We reserve the right to refuse service to anyone for any reason
                at any time.
              </p>

              <p className="mt-4">
                You agree not to reproduce, duplicate, copy, sell, resell or
                exploit any portion of the Service, use of the Service, or
                access to the Service without our express written permission.
              </p>

              <p className="mt-4">
                The headings used in this agreement are included for convenience
                only and will not limit or otherwise affect these Terms.
              </p>
            </section>

            {/* Information */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                3. Accuracy, Completeness & Timeliness of Information
              </h2>

              <p>
                We are not responsible if information made available on this
                site is not accurate, complete or current. Material on this site
                is provided for general information only and should not be
                relied upon as the sole basis for making decisions.
              </p>

              <p className="mt-4">
                This site may contain historical information. Historical
                information is not current and is provided for reference only.
                We reserve the right to modify the contents of this site at any
                time, but have no obligation to update information.
              </p>
            </section>

            {/* Modifications and Prices */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                4. Modifications to the Service & Prices
              </h2>

              <p>
                Prices for our products are subject to change without notice. We
                reserve the right to modify or discontinue the Service, or any
                part of it, without notice.
              </p>

              <p className="mt-4">
                We shall not be liable to you or any third party for any
                modification, price change, suspension or discontinuance of the
                Service.
              </p>
            </section>

            {/* Products */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                5. Products or Services
              </h2>

              <p>
                Certain products or services may be available exclusively online
                and may have limited quantities. Products are subject to our{" "}
                <Link
                  href="/returns-refunds"
                  className="font-medium underline hover:no-underline"
                >
                  Returns & Refunds Policy
                </Link>
                .
              </p>

              <p className="mt-4">
                We have made every effort to display product colors and images
                as accurately as possible. However, we cannot guarantee that
                your device or computer monitor will accurately display every
                color.
              </p>

              <p className="mt-4">
                We reserve the right to limit sales of our products or services
                to any person, geographic region or jurisdiction and to limit
                the quantities of products offered.
              </p>

              <p className="mt-4">
                Product descriptions and pricing may be changed at any time
                without notice. We also reserve the right to discontinue any
                product at any time.
              </p>
            </section>

            {/* Billing */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                6. Accuracy of Billing & Account Information
              </h2>

              <p>
                We reserve the right to refuse any order you place with us. We
                may, at our discretion, limit or cancel quantities purchased per
                person, household or order.
              </p>

              <p className="mt-4">
                You agree to provide current, complete and accurate purchase and
                account information for all purchases made at our store. You
                also agree to promptly update your information so that we can
                complete your transactions and contact you when necessary.
              </p>

              <p className="mt-4">
                For more information regarding returns and exchanges, please
                review our{" "}
                <Link
                  href="/returns-refunds"
                  className="font-medium underline hover:no-underline"
                >
                  Returns & Refunds Policy
                </Link>
                .
              </p>
            </section>

            {/* Optional Tools */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                7. Optional Tools
              </h2>

              <p>
                We may provide access to third-party tools over which we have no
                control or input. These tools are provided on an “as is” and “as
                available” basis without warranties or representations.
              </p>

              <p className="mt-4">
                Any use of optional third-party tools is entirely at your own
                risk and discretion. New services or features introduced in the
                future shall also be subject to these Terms.
              </p>
            </section>

            {/* Third Party Links */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                8. Third-Party Links
              </h2>

              <p>
                Certain content, products and services available through our
                Service may include materials from third parties.
              </p>

              <p className="mt-4">
                Third-party links may direct you to websites that are not
                affiliated with us. We are not responsible for examining or
                evaluating the content, accuracy or practices of third-party
                websites.
              </p>

              <p className="mt-4">
                Any complaints, claims or questions regarding third-party
                products or services should be directed to the relevant third
                party.
              </p>
            </section>

            {/* Comments */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                9. User Comments, Feedback & Submissions
              </h2>

              <p>
                If you send us creative ideas, suggestions, proposals, plans or
                other materials, whether online, by email, postal mail or
                otherwise, you agree that we may edit, copy, publish,
                distribute, translate or otherwise use those comments in any
                medium.
              </p>

              <p className="mt-4">
                We may monitor, edit or remove content that we determine to be
                unlawful, offensive, threatening, defamatory, obscene or
                otherwise objectionable.
              </p>

              <p className="mt-4">
                You agree that your comments will not violate the rights of any
                third party or contain unlawful, abusive or malicious content.
                You are solely responsible for comments you make and their
                accuracy.
              </p>
            </section>

            {/* Personal Information */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                10. Personal Information
              </h2>

              <p>
                Your submission of personal information through the store is
                governed by our Privacy Policy.
              </p>

              <Link
                href="/privacy-policy"
                className="mt-4 inline-block font-medium underline hover:no-underline"
              >
                View our Privacy Policy
              </Link>
            </section>

            {/* Errors */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                11. Errors, Inaccuracies & Omissions
              </h2>

              <p>
                Occasionally there may be information on our site or in the
                Service containing typographical errors, inaccuracies or
                omissions relating to product descriptions, pricing, promotions,
                shipping charges, transit times or availability.
              </p>

              <p className="mt-4">
                We reserve the right to correct errors, inaccuracies or
                omissions and to change or update information or cancel orders
                if information is inaccurate, including after an order has been
                submitted.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                12. Prohibited Uses
              </h2>

              <p>You are prohibited from using the site or its content:</p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>For any unlawful purpose.</li>
                <li>
                  To violate any applicable laws, regulations or ordinances.
                </li>
                <li>
                  To infringe upon our intellectual property rights or those of
                  others.
                </li>
                <li>To harass, abuse, insult, harm or defame others.</li>
                <li>To submit false or misleading information.</li>
                <li>To upload or transmit viruses or malicious code.</li>
                <li>
                  To spam, phish, crawl, scrape or collect information
                  improperly.
                </li>
                <li>
                  To interfere with or circumvent security features of the
                  Service or website.
                </li>
              </ul>

              <p className="mt-4">
                We reserve the right to terminate your use of the Service for
                violating any prohibited uses.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                13. Disclaimer of Warranties & Limitation of Liability
              </h2>

              <p>
                We do not guarantee that your use of our Service will be
                uninterrupted, timely, secure or error-free. We also do not
                warrant that results obtained from using the Service will be
                accurate or reliable.
              </p>

              <p className="mt-4">
                Your use of, or inability to use, the Service is at your own
                risk. The Service and products delivered through the Service are
                provided on an “as is” and “as available” basis, except where
                expressly stated otherwise.
              </p>

              <p className="mt-4">
                To the maximum extent permitted by applicable law, Rocks
                Hairmpire and its directors, officers, employees, affiliates,
                agents, contractors, suppliers and service providers shall not
                be liable for indirect, incidental, punitive, special or
                consequential damages arising from your use of the Service or
                products purchased through it.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                14. Indemnification
              </h2>

              <p>
                You agree to indemnify, defend and hold harmless Rocks
                Hairmpire, including its affiliates, partners, officers,
                directors, agents, contractors, suppliers and employees, from
                any claim or demand arising from your breach of these Terms or
                violation of any law or third-party rights.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                15. Severability
              </h2>

              <p>
                If any provision of these Terms is determined to be unlawful,
                void or unenforceable, that provision shall be enforced to the
                fullest extent permitted by law, and the unenforceable portion
                shall be severed without affecting the validity of the remaining
                provisions.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                16. Termination
              </h2>

              <p>
                These Terms are effective unless and until terminated by either
                you or us. You may terminate your agreement by notifying us that
                you no longer wish to use our Services or by ceasing to use our
                site.
              </p>

              <p className="mt-4">
                If we believe that you have failed to comply with any term or
                provision of these Terms, we may terminate the agreement without
                notice and may deny you access to our Services.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                17. Entire Agreement
              </h2>

              <p>
                These Terms of Service and any policies or operating rules
                posted on this site constitute the entire agreement between you
                and Rocks Hairmpire and govern your use of the Service.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                18. Governing Law
              </h2>

              <p>
                These Terms of Service and any separate agreements through which
                we provide Services shall be governed by and construed in
                accordance with the laws of <strong>Nigeria</strong>.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                19. Changes to Terms of Service
              </h2>

              <p>
                You can review the most current version of these Terms of
                Service at any time on this page.
              </p>

              <p className="mt-4">
                We reserve the right, at our sole discretion, to update, change
                or replace any part of these Terms by posting updates and
                changes to our website. Your continued use of our website or
                Service following the posting of changes constitutes acceptance
                of those changes.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl bg-gray-50 p-6">
              <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                20. Contact Information
              </h2>

              <p>
                If you have any questions about these Terms of Service, please
                contact Rocks Hairmpire through the contact information provided
                on our website.
              </p>
            </section>

            {/* Bottom Links */}
            <div className="flex flex-wrap gap-4 border-t pt-8">
              <Link
                href="/returns"
                className="font-medium text-gray-900 underline hover:no-underline"
              >
                Returns & Refunds
              </Link>

              {/* <Link
                href="/privacy-policy"
                className="font-medium text-gray-900 underline hover:no-underline"
              >
                Privacy Policy
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
