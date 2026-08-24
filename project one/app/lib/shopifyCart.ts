export function getCartId() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("cartId");
}


export function saveCartId(id:string) {

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartId",
      id
    );
  }

}