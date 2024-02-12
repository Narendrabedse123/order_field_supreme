import React, { useState, useEffect } from "react";

const Pagination = ({ showPerPage, onPaginationChange, total }) => {
  const [counter, setCounter] = useState(1);
  const [numberOfButtons, setNumberOfButoons] = useState(
    Math.ceil(total / showPerPage)
  );

  useEffect(() => {

    const value = showPerPage * counter;
    onPaginationChange(value - showPerPage, value);
  }, [counter]);

  const onButtonClick = (type) => {
    if (type === "prev") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "next") {
      if (Math.ceil(total / showPerPage) === counter) {
        setCounter(counter);
      } else {
        setCounter(counter + 1);
      }
    }
  };
  return (

    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">

            <button
              className="page-link"

              onClick={() => onButtonClick("prev")}
            >
              Previous
            </button>
          </li>

          {/* {new Array(Math.ceil(total / showPerPage)).fill("").map((el, ind) => (
            <li className={`page-item ${ind + 1 === counter ? "active" : null}`}>
              <button
                className="page-link"

                onClick={() => setCounter(ind + 1)}
              >
                {ind + 1}
              </button>
            </li>
          ))} */}

          <li className="page-item">
            <button
              className="page-link"

              onClick={() => onButtonClick("next")}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

  );

};


export default Pagination;