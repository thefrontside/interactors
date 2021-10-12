import React from "react";
// import SearchBar from "@theme/SearchBar"; // TODO: look into search bar requirements
import { useThemeConfig } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";

import Logo from "@theme/Logo";
import {
  navBar,
  navLink,
  logoCol,
  // logoFrontside,
  // frontsideLink
} from './navbar.css';

// import FSLogo from './fs-icon';

function Navbar() {
  let {
    navbar: { items, title },
  } = useThemeConfig();

  return (
    <nav className={navBar[title]}>
      <div className={logoCol}>
        {/* <a href="https://frontside.com/" target="_blank" className={frontsideLink} >
          <FSLogo className={logoFrontside} />
        </a> */}
        <Logo />
      </div>
      <div>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {(!!item.to ? (
              <Link to={item.to} className={navLink}>{item.label}</Link>
            ) : (
              <a href={item.href} className={navLink} target="_blank" rel="noreferrer noopener">{item.label}</a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
