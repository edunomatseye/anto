import { Product } from 'libs/product/src/index';
import { Sidebar } from 'libs/sidebar/src/index';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <Sidebar />
          <Product />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
