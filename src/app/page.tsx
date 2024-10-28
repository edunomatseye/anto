import { Product } from '@anto/product';
import { Sidebar } from '@anto/sidebar';

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
        </div>
      </div>
    </div>
  );
}
