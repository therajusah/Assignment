
import Layout from "@/components/Layout/Layout";
import BarcodeSearch from "@/components/BarcodeSearch";

const BarcodeSearchPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <BarcodeSearch />
      </div>
    </Layout>
  );
};

export default BarcodeSearchPage;
