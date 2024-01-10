import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";

import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { StockTable } from "./StockTable";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectStock,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchStock,
} from "./stockSlice";

import { selectUser } from "../../../modules/Auth/_redux/authRedux";
import { showErrorDialog } from "../../../utility";
import LoadingFetchData from "../../../utility/LoadingFetchData";

export const StockPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const data = useSelector(selectStock);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Filter
  const [vendorCode, setVendorCode] = useState("");
  const [region, setRegion] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [valueNmbr, setValueNmbr] = useState(""); //buat deklarasi state

  const filterVendorCode =
    user.vendor_code === null ? vendorCode : user.vendor_code;
  const filterPurOrg =
    user.purch_org === null ? valueNmbr : user.purch_org;

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      vendor_code: filterVendorCode,
      region_name: region,
      valid_from: validFrom,
      valid_to: validTo,
      purch_org: filterPurOrg, //valueNmbr, //parameter pembacaan u/ melakukan permintaan API
      pageNo: 1,
      pageSize: 10,
    };

    //--Validasi
    if (validFrom && validTo === "") {
      return showErrorDialog("Please Select End Date ");
    }
    if (validTo && validFrom === "") {
      return showErrorDialog("Please Select Start Date");
    }
    //--

    try {
      const response = await dispatch(fetchStock(params));
      if (response.payload.data.status === 200) {
        setOverlayLoading(false);
      } else if (
        response.payload.data.error === "10008" ||
        response.payload.data.error === "10009"
      ) {
        const action = await showErrorDialog(response.payload.data.message);
        if (action.isConfirmed) await history.push("/logout");
      } else {
        showErrorDialog(response.payload.data.message);
        setOverlayLoading(false);
      }
    } catch (error) {
      showErrorDialog(error.message);
      setOverlayLoading(false);
    }
  };

  const handleTableChange = async (
    type,
    { page, sizePerPage, sortField, sortOrder, data }
  ) => {
    if (type === "pagination") {
      const params = {
        vendor_code: filterVendorCode,
        region_name: region,
        valid_from: validFrom,
        valid_to: validTo,
        purch_org: filterPurOrg, //valueNmbr,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchStock(params));
        if (response.payload.data.status === 200) {
        } else if (
          response.payload.data.error === "10008" ||
          response.payload.data.error === "10009"
        ) {
          // Corrected the syntax here
          const action = await showErrorDialog(response.payload.data.message);
          if (action.isConfirmed) await history.push("/logout");
        } else {
          // Corrected the syntax here
          const action = await showErrorDialog(response.payload.data.message);
          if (action.isConfirmed) await history.push("/logout");
          valueNmbr = action.payload.value; // Corrected the syntax here
          setOverlayLoading(false);
        }
      } catch (error) {
        showErrorDialog(error.message);
      }
    } else {
      let result;
      if (sortOrder === "asc") {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
        console.log(result, "asc");
      } else {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
        console.log(result, "desc");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Stock Depo">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger mr-4"
            onClick={() => history.push("/masterdata/depo/stock/upload")}
          >
            Upload
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/masterdata/depo/stock/create")}
          >
            Create
          </Button>
        </CardHeaderToolbar>
      </CardHeader>
      <LoadingFetchData active={overlayLoading} />
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
              {user.vendor_code !== null && (
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>Vendor</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Vendor"
                      value={user.vendor_name}
                      disabled
                    />
                  </Col>
                </Form.Group>
              )}
              {user.vendor_code === null && (
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>Vendor </b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Vendor"
                      onChange={(e) => {
                        setVendorCode(e.target.value);
                      }}
                      value={vendorCode}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>
              )}
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Region</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Region"
                    onChange={(e) => setRegion(e.target.value)}
                    value={region}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}
            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Valid Date</b>
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="date"
                    placeholder="Valid From"
                    sm={6}
                    onChange={(e) => setValidFrom(e.target.value)}
                    value={validFrom}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
                <b className="mt-3">To</b>
                <Col sm={4}>
                  <Form.Control
                    type="date"
                    placeholder="Valid To"
                    sm={6}
                    onChange={(e) => setValidTo(e.target.value)}
                    value={validTo}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row}>
                <Col sm={6}>
                  {user.purch_org !== null && (
                    <Form.Group as={Row} className="mt-5">
                      <Form.Label column sm={6}>
                        <b>Purchasing Organization</b>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Purchasing Organization"
                          value={user.purch_org}
                          disabled
                        />
                      </Col>
                    </Form.Group>
                  )}
                  {user.purch_org === null && (
                    <Form.Group as={Row} className="mt-5">
                      <Form.Label column sm={6}>
                        <b>Purchasing Organization</b>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Purchasing Organization"
                          onChange={(e) => {
                            setValueNmbr(e.target.value);  
                          }}
                          value={valueNmbr}  
                          onKeyPress={handleKeyPress}
                        />
                      </Col>
                    </Form.Group>
                 )}
                  <Button className="btn btn-danger" onClick={handleSearch}>
                    Search
                  </Button>
                  {/* <Col sm={3}>
                    <Button
                      className="btn btn-danger"
                      onClick={() => history.push("/masterdata/vendor-create")}
                    >
                      Create
                    </Button>
                  </Col> */}
                </Col>
              </Form.Group>
            </Col>

          </Form.Group>
        </Form>

        {/* Table */}
        {data && data.length > 0 && (
          <StockTable
            data={data}
            page={pageNo}
            sizePerPage={pageSize}
            totalSize={totalRecord}
            onTableChange={handleTableChange}
            loading={loading}
          />
        )}
      </CardBody>
    </Card>
  );
};
