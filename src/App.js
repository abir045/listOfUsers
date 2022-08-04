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

  //setting search query to empty string
  const [q, setQ] = useState("");

  //setting search parameters

  const [searchParam] = useState(["name", "email", "login"]);

  //setting filter parameters
  const [filterParam, setFilterParam] = useState(["all"]);

  // number of users to be shown per page
  const [numberOfUsers] = useState(10);

  //getting index of  last user on that page
  const indexOfLastUser = currentPage * numberOfUsers;

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

  //  Search function
  const search = (items) => {
    return items.filter((item) => {
      if (item.gender === filterParam) {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      } else if (filterParam === "all") {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      }
    });
  };

  console.log(items);

  if (error) {
    return <>{error.message}</>;
  } else if (!isLoaded) {
    return <>Loading...</>;
  } else {
    return (
      <div className="flex-col mx-14 my-10 space-y-10 ">
        <h1 className="font-bold ">User List</h1>

        <div className="flex justify-between">
          <form className="flex">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >
              Search
            </label>
            <div class="relative">
              <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  data-darkreader-inline-stroke=""
                  // style="--darkreader-inline-stroke:currentColor;"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="block p-4 pl-10 w-[1/2] text-sm text-gray-900 bg-gray-50 rounded-3xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </form>
          <div
            onChange={(e) => {
              setFilterParam(e.target.value);
            }}
            className="flex flex-row space-x-10"
          >
            <legend className="flex">Filter by:</legend>

            <div className="space-x-5">
              <input type="radio" id="all" name="gender" value="all" />
              <label for="all">All</label>
            </div>

            <div className="space-x-5">
              <input type="radio" id="male" name="gender" value="male" />
              <label for="male">Male</label>
            </div>

            <div className="space-x-5">
              <input type="radio" id="female" name="gender" value="female" />
              <label for="female">Female</label>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr className="flex space-x-[280px]">
              <th className="flex">Name</th>
              <th className="flex">Registration Date</th>
              <th className="flex">Username</th>
            </tr>
          </thead>
        </table>

        {search(currentUsers).map((item) => {
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
