import { PaginatedListWrapper } from "@/components/organism/PaginatedListWrapper";

const Customers = () => {
  return (
    <PaginatedListWrapper
      queryKey="customersList"
      endpoint="/customers/get-customers"
      type="customers"
    />
  );
};

export default Customers;
