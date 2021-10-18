/* eslint-disable prefer-let/prefer-let */
import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  featureImage,
  featureRow,
  featureText,
  featureTextAlternate,
  featureImageSmaller,
  heroText,
  heroWrap,
  homeBottomCTA,
  pageWrap
} from "../css/page.css";
import { bigQuote,
  bigQuoteAuthor,
  featureHeading,
  heading3Xl,
  textGradientPinkPurple,
  textLg,
  mardownColumn
} from "../css/typography.css";
import {
  heroCode
} from "../css/interactors.css";

import { actionButton } from "../css/buttons.css";

// // originally from interactors/getting-started/why-bigtest

// Who should use BigTest? (need a better name for this) - someone should be able to link to this page, and it is their persuasive argument for why the team should adopt these tools. These are not sections but more like points that should be covered in some way:

// 1-2 sentences that explain the “why”

// What can you test with Interactors/BigTest?

// What problems does this solve/benefits? (Easier to write tests, refactor UIs, shared testing helpers for component libraries, can test for a11y, etc)

// How this fits into an existing testing strategy

// // originally from interactors/overview

// Overview
//   - this article sets the stage for how the pieces fit together

// - 1-2 sentences of what an interactor is
//   - I think Charles?: BigTest Interactors provide an API to access the components of a user interface by finding them, observing their state, and manipulating them all from the same perspective as a user.
// - Code example
// - Summary of what someone will learn
// - Brief explanation of Actions, Locators, Filters. We do this here because reading an in-depth article about each, introduced one at a time, can be disorienting
// - Why use interactors?

// ***
// i brought this over from asynchronus page as i think it makes more sense to describe the principles here:
//   - 1-2 sentences that say the most important thing - you don’t need to worry about async interactions
//   - Example of a common async UI pattern
//   - How Interactors help you solve it
//   - How is this possible? Introduce the term convergence
// ***

const features = [
  {
    title: "Testing a UI should be as easy as building it",
    imageUrl: "images/design-systems.png",
    description: (
      <>
        Interactors allow design systems maintainers to ship reusable
        and simplified testing practices alongside their components.
        Thus, their users can start testing right away without figuring
        out internal markup or selectors.
      </>
    ),
    alternate: false,
  },
  {
    title: "Compatible with your test suite",
    imageUrl: "images/cross-platform.png",
    description: (
      <>
        Interactors work out-of-the-box with your existing tests in Jest,
        Cypress, BigTest, and more. You can add them in over time to improve
        what you already have.
      </>
    ),
    alternate: true,
  },
  {
    title: "UX & a11y centric",
    imageUrl: "images/ux-centric.png",
    description: (
      <>
        Nobody uses an app by searching <code>[test-data-submit-button]</code>{" "}
        selectors: we read labels, click buttons, or navigate through
        keystrokes. Interactors help you detect interaction flaws such as
        ambiguity in the elements of your page or the lack of adequate aria
        labels.
      </>
    ),
    alternate: false,
  },
];

function Feature({ imageUrl, title, description, alternate }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={featureRow}>
      <div className={alternate ? featureTextAlternate : featureText}>
        <h2 className={featureHeading}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={featureImage}>
        <img src={imgUrl} className={featureImageSmaller} alt="" />
      </div>
    </div>
  );
}

function Interactors() {
  const context = useDocusaurusContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { siteConfig = {} } = context;
  return (
    <Layout
      title="Interactors: composable page objects"
      description="Test your app as real people use it"
    >
      <header className={heroWrap}>
        <div className={heroText}>
          <h1 className={heading3Xl}>
            <span className={textGradientPinkPurple}>Interactors:</span><br />page objects for components libraries
          </h1>
          <p className={textLg}>
            Improve your users testing experience and make maintenance easier for yourself
          </p>
          <Link className={actionButton} to={useBaseUrl("docs")}>
            Get Started
          </Link>
        </div>
        <div className={heroCode}>
            <Tabs
              defaultValue="jest"
              values={[
                { label: "Jest", value: "jest" },
                { label: "Cypress", value: "cypress" },
                { label: "Bigtest", value: "bigtest" },
              ]}
            >
              <TabItem value="jest">
                <CodeBlock className="language-js">
                  {`it('subscribes to newsletter', async () => {
 await Input('email').fillIn('jorge@frontside.com');
 await Button('Subscribe').click();

 await Heading('Thanks!').exists();
})`}
                </CodeBlock>
              </TabItem>
              <TabItem value="cypress">
                <CodeBlock className="language-js">
                  {`it('subscribes to newsletter', () => {
  cy.do([
    Input('email').fillIn('jorge@frontside.com'),
    Button('Subscribe').click()
  ]);
  cy.expect([
    Heading('Thanks!').exists();
  ])
})`}
                </CodeBlock>
              </TabItem>
              <TabItem value="bigtest">
                <CodeBlock className="language-js">
                  {`test('subscribes to newsletter')
.step([
  Input('email').fillIn('jorge@frontside.com'),
  Button('Subscribe').click()
])
.assertion(
  Heading('Thanks!').exists()
);`}
                </CodeBlock>
              </TabItem>
            </Tabs>
        </div>
      </header>
      <main className={pageWrap}>
        <Feature {...features[0]} />

        <div>
          <blockquote className={bigQuote}>
          “
            <strong>
              Gone are the days of fragile, hard-coded selectors or
              dependencies on mark-up structure in your consumers’ test cases
            </strong>
            ”
          </blockquote>
          <p className={bigQuoteAuthor}>
            — John Coburn, Component Library Lead at FOLIO
          </p>
        </div>

        <Feature {...features[1]} />

        <Feature {...features[2]} />

        <p className={homeBottomCTA}>
          <Link className={actionButton} to={useBaseUrl("docs")}>
            Try Interactors
          </Link>
        </p>

        <section className={mardownColumn}>
          <h2>Why use Interactors?</h2>
          <p>
            In many typical test suites, if you change something about one
            button, you may have to change dozens of tests. It can take more
            time to update the tests than to make the change in the codebase.
            Does that sound familiar?
          </p>
          <p>
            Interactors were designed to help solve this problem and bring
            your user interface tests closer to what users actually do.
          </p>
          <p>
            A user finds something they want to interact with, takes action,
            and gets a result. The code to accomplish these same steps in a
            test is in one place as an Interactor. These Interactors can then
            be reused in many different test contexts. You can even create
            your own Interactors that test for whether a UI is accessible to
            people using assistive technology or navigating by keyboard
            controls.
          </p>
          <p>
            Best of all, you do not need to throw out your existing tests when
            you try out Interactors! They fit right in with the work that you
            have already done. Try out the Quick Start guide to see this in
            action in your own app's test suite.
          </p>
        </section>
      </main>
    </Layout>
  );
}

export default Interactors;
