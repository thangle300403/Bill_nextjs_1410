import CheckoutPage from "@/components/checkOut/CheckOutPage";
// import ShowLoginPopup from "@/components/ShowLoginPopup";
import { getServerUser } from "@/lib/getServerUser";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import WithAuthClient from "@/lib/WithAuthClient";
import { Province } from "@/types/address";

export default async function Page() {
  const user = await getServerUser();

  // if (!user) {
  //   return <ShowLoginPopup />;
  // }

  const provinceId = user?.ward?.provinceId;
  let shippingFee = 0;

  if (provinceId) {
    try {
      const res = await axiosNonAuthInstanceNest.get(
        `/shippingFees/${provinceId}`
      );
      shippingFee = res.data;
    } catch (err) {
      console.error("Failed to load shipping fee:", err);
    }
  }

  const provinces = await axiosNonAuthInstanceNest
    .get<Province[]>(`/provinces`)
    .then((res) => res.data)
    .catch(() => []);

  return (
    <WithAuthClient>
      <CheckoutPage
        shippingFee={shippingFee}
        provinces={provinces}
        loggedUser={user}
      />
    </WithAuthClient>
  );
}
