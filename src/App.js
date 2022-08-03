import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // number of users to be shown per page
  const [numberOfUsers] = useState(10);

  //getting index of  last user on that page
  const indexOfLastUser = currentPage * numberOfUsers;
  // getting thw index of first user on that page
  // const indexOfFirstUser = indexOfLastUser - numberOfUsers;

  //getting current users

  const currentUsers = items.slice(
    indexOfLastUser,
    indexOfLastUser + numberOfUsers
  );

  //calculating total pages

  const totalPages = Math.ceil(items.length / numberOfUsers);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    const getData = async () => {
      const userData = await fetch("https://randomuser.me/api/?results=50");
      const response = await userData.json();
      setItems(response.results);
      setIsLoaded(true);
    };
    getData();
  }, []);

  console.log(items);

  if (error) {
    return <>{error.message}</>;
  } else if (!isLoaded) {
    return <>Loading...</>;
  } else {
    return (
      <div className="flex-col mx-14 my-10 space-y-10 ">
        <h1 className="font-bold ">User List</h1>
        <table>
          <thead>
            <tr className="flex space-x-[280px]">
              <th className="flex">Name</th>
              <th className="flex">Registration Date</th>
              <th className="flex">Username</th>
            </tr>
          </thead>
        </table>

        {currentUsers.map((item) => {
          return (
            <table>
              <tbody>
                <tr className="flex space-x-[120px]">
                  <td>
                    <div className="flex space-x-6">
                      <img
                        className="flex rounded-full "
                        src={item.picture.thumbnail}
                        alt="user thumbnail"
                      />
                      <div className="flex-col">
                        <p className="flex">
                          {item.name.last},{item.name.first}
                        </p>
                        <p>{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex">
                      <p className="flex">
                        {moment(item.registered.date)
                          .utc()
                          .format("YYYY-MM-DD")}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex mx-46">
                      <p>{item.login.username}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        })}
        <ReactPaginate
          className="flex justify-end space-x-10"
          previousLabel={"<<"}
          nextLabel={">>"}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
    );
  }
}

export default App;
