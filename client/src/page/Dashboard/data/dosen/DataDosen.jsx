import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../../../features/counter/authSlice";
import Layout from "../../../../component/Layout/Layout";
import AddDosen from "../../../../component/CRUD/dosen/AddDosen";
import UpdateDosen from "../../../../component/CRUD/dosen/UpdateDosen";
import DeletedDosen from "../../../../component/CRUD/dosen/DeletedDosen";

const DataDosen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.data.role !== "admin" && user && user.data.role !== "departement") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  const [dataPost, setdataPost] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState();
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    getDataDosen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]);
  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "* Jika data yang anda cari tidak ditemukan, carilah dengan kata kunci yang spesifik"
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };
  const getDataDosen = async () => {
    try {
      const respon = await axios.get(
        ` http://localhost:5000/api/v1/dosen?search=${keyword}&page=${page}&limit=${limit}`
      );
      // console.log(respon)
      setdataPost(respon.data.data);
      setPage(respon.data.page);
      setPages(respon.data.allPages);
      setRows(respon.data.allRows);
      setLimit(respon.data.limit);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };
  return (
    <Layout>
      <div>
        <div className="d-sm-flex align-items-center justify-content-between border-bottom">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active ps-0"
                id="home-tab"
                data-bs-toggle="tab"
                href="#overview"
                role="tab"
                aria-controls="overview"
                aria-selected="true"
              >
                Data Dosen
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content tab-content-basic">
          <div
            className="tab-pane fade show active"
            id="overview"
            role="tabpanel"
            aria-labelledby="overview"
          >
            <div className="row">
              <div className="col-sm-12">
                <div className="statistics-details d-flex align-items-center justify-content-between">
                  <div>
                    <p className="statistics-title">Total Dosen</p>
                    <h3 className="rate-percentage ">{rows} Data</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Table Dosen</h4>
                  <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
                    <div className="container-fluid">
                      <form className="d-flex" onSubmit={searchData}>
                        <input
                          className="form-control search me-2"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="control">
                          <button
                            className="btn-search btn-outline-success"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                      <ul className="navbar-nav mb-2 mb-lg-0 "></ul>
                      {
                        user && user.data.role === "admin" && (
                          <AddDosen isLoad={getDataDosen} />
                        )
                      }
                    </div>
                  </nav>
                  <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>Nama Dosen</th>
                          <th>Nip</th>
                          <th>Departemen</th>
                          <th>Role</th>
                          {
                            user && user.data.role === "admin" && (
                              <>
                                <th>Action</th>
                              </>
                            )
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {dataPost.map((data) => {
                          return (
                            <tr key={data.id_dsn}>
                              <td>{data.nama}</td>
                              <td>{data.noInduk}</td>
                              <td>{data.kode_departement}</td>
                              <td>{data.role}</td>
                              {
                                user && user.data.role === "admin" && (
                                  <>
                                    <td>
                                      <div className="d-flex gap-3">
                                        <UpdateDosen
                                          isUpdate={getDataDosen}
                                          datas={data}
                                        />
                                        <DeletedDosen
                                          isDeleted={getDataDosen}
                                          data={data}
                                        />
                                      </div>
                                    </td>
                                  </>
                                )
                              }

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="d-flex gap-3 mt-4  align-self-end footer-table">
                      <p className="mt-2">
                        Page : {rows ? page + 1 : 0}{" "}
                        <i class="fa fa-light fa-minus"></i> {pages} of {rows}
                      </p>
                      <nav className="pagination" key={rows}>
                        <ReactPaginate
                          previousLabel={"<<"}
                          nextLabel={">>"}
                          pageCount={Math.min(10, pages)}
                          onPageChange={changePage}
                          containerClassName="pagination  "
                          pageLinkClassName={"page-link"}
                          pageClassName={"page-item"}
                          disabledClassName={"page-item disabled"}
                          disabledLinkClassName={"page-link "}
                          nextLinkClassName={"page-link "}
                          previousLinkClassName={"page-link"}
                          activeClassName="page-item active"
                        ></ReactPaginate>
                      </nav>
                    </div>
                    <p className="text-danger ">{msg}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataDosen;
