import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=Sapa,Đà Nẵng,Nha Trang"
  );

  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : (
        <>
          <div className="featuredItem">
            <img
              src="https://th.bing.com/th/id/OIP.R8DBTlQ40DJp8P9Mdev3FAHaFj?rs=1&pid=ImgDetMain"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Sapa</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://res.cloudinary.com/tubudd/image/upload/v1562591028/cities/da-nang2.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Đà Nẵng</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://www.sceniabay.vn/wp-content/uploads/2017/12/nha-trang.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Nha Trang</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
