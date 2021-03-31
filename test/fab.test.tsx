import { test, Page, HTML } from "bigtest";
import { Fab as Interactor, including } from '../src/index';
import { Fab as MuiFab, Icon as MuiIcon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { render } from './helpers';

const Span = HTML.extend('span').selector('span')

const fab = Interactor();

export default test("Fab")
  .step(Page.visit("/"))
  .child("can render a floating action button", (test) => test
    .step("render fab", async() => {
      await render(<MuiFab>My Fab</MuiFab>)
    })
    .assertion(fab.exists())
    .assertion(fab.has({ text: "My Fab".toUpperCase()}))
  )
  .child("renders extended floating action button", (test) => test
    .step("render extended Fab", async() => {
      await render(<MuiFab variant="extended">My Fab</MuiFab>)
    })
    .assertion(fab.has({ className: including('MuiFab-extended')}))
  )
  .child("render Icon with children with right classes", (test) => test
    .step("render Fab with Icon", async() => {
      const childClassName = 'child-woof';
      const iconChild = <MuiIcon data-testid="icon" className={childClassName} />;
      await render(<MuiFab>{iconChild}</MuiFab>);
    })
    .assertion(fab.find(Span({ className: including('child-woof')})).exists())
  )
  .child("render Fab with only icon and aria-label", (test) => test
    .step("render Fab", async() => {
      await render(
        <MuiFab color="primary" aria-label="add">
           <AddIcon />
        </MuiFab>
      )
    })
    .assertion(fab.has({ ariaLabel: including('add')}))
    .assertion(fab.has({ svgIcon: true}))
  )