import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { CheckoutFlow } from "@/components/motion/checkout-pages";

afterEach(cleanup);

test("payment attempts require a current provider method and an explicit paid outcome", async () => {
  let submissions = 0;
  const view = render(<CheckoutFlow
    defaultItems={[{ id: "product", name: "Notebook", unitAmount: 1200, quantity: 1 }]}
    shippingOptions={[{ id: "standard", name: "Standard", amount: 0 }]}
    paymentMethods={[]}
    pricing={{ currency: "USD", taxBasisPoints: 0 }}
    renderPaymentForm={({ onReady }) => <>
      <button type="button" onClick={() => onReady({ id: "provider-token", label: "Authorized card" })}>Authorize provider method</button>
      <button type="button" onClick={() => onReady(null)}>Revoke provider method</button>
    </>}
    onPlaceOrder={async () => {
      submissions += 1;
      return submissions === 1 ? { status: "pending" } : { status: "paid", orderId: "confirmed-order-42" };
    }}
  />);
  for (const [label, value] of Object.entries({ Email: "buyer@example.test", "Full name": "Ada Buyer", Address: "10 Garden Street", City: "Portland", "Postal code": "97201" })) {
    fireEvent.change(view.getByLabelText(label), { target: { value } });
  }
  fireEvent.click(view.getByRole("button", { name: "Continue" }));
  fireEvent.click(view.getByRole("button", { name: "Continue" }));

  const pay = view.getByRole("button", { name: /^Pay / }) as HTMLButtonElement;
  expect(pay.disabled).toBe(false);
  fireEvent.click(pay);
  expect(submissions).toBe(0);
  expect(view.queryByText("confirmed-order-42")).toBeNull();

  fireEvent.click(view.getByRole("button", { name: "Authorize provider method" }));
  fireEvent.click(pay);
  await waitFor(() => expect(pay.disabled).toBe(false));
  expect(submissions).toBe(1);
  expect(view.queryByText("confirmed-order-42")).toBeNull();

  fireEvent.click(view.getByRole("button", { name: "Revoke provider method" }));
  fireEvent.click(pay);
  expect(submissions).toBe(1);

  fireEvent.click(view.getByRole("button", { name: "Authorize provider method" }));
  fireEvent.click(pay);
  await waitFor(() => expect(view.getByText("confirmed-order-42")).toBeTruthy());
  expect(submissions).toBe(2);
  expect(view.queryByRole("button", { name: /^Pay / })).toBeNull();
});
