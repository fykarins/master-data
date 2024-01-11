import React, { useEffect, useState } from "react";

import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../_metronic/_partials/controls";

import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { VendorStockTable } from "./VendorStockTable";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectVendorStock,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchVendorStock,
} from "./vendorStockSlice";
import { showErrorDialog } from "../../../utility";
import LoadingFetchData from "../../../utility/LoadingFetchData";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";

export const VendorStockPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectVendorStock);
  const user = useSelector(selectUser);

  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const filterVendorCode = user.vendor_code === null ? lifnr : user.vendor_code;

  // Filter;
  const [matnr, setMatnr] = useState("");
  const [werks, setWerks] = useState("");
  const [lifnr, setLifnr] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [valueNmbr, setValueNmbr] = useState(""); //buat deklarasi state

  //console.log(vendorCode, "vendorcode");
  //console.log(filterVendorCode, "filterVendorCode");
  const filterPurOrg =
    user.purch_org === null ? valueNmbr : user.purch_org;

  const handleSearch = async () => {
    const params = {
      MSLB_LIFNR: filterVendorCode,
      MSLB_MATNR: matnr,
      MSLB_WERKS: werks,
      MSLB_LIFNR: lifnr,
      purch_org: filterPurOrg, //valueNmbr, //parameter pembacaan u/ melakukan permintaan API
      pageNo: 1,
      pageSize: 10,
    };
    console.log(params, "params");
    try {
      const response = await dispatch(fetchVendorStock(params));
      if (response.payload.data.status === 200) {
        setOverlayLoading(false);
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
      setOverlayLoading(false);
    }
  };

  const handleTableChange = async (
    type,
    { page, sizePerPage, sortField, sortOrder, data }
  ) => {
    if (type === "pagination") {
      const params = {
        MSLB_LIFNR: filterVendorCode,
        MSLB_MATNR: matnr,
        MSLB_WERKS: werks,
        MSLB_LIFNR: lifnr,
        purch_org: filterPurOrg, //valueNmbr, //parameter pembacaan u/ melakukan permintaan API
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchVendorStock(params));
        if (response.payload.data.status === 200) {
          setOverlayLoading(false);
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
        setOverlayLoading(false);
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

  // const handleDownload = () => {
  //   let URL =
  //     `${env.REACT_APP_API_URL}/api/vendorStock/exportToExcel` +
  //     `?MSLB_MATNR=${matnr}` +
  //     `?MSLB_WERKS=${werks}` +
  //     `?MSLB_LIFNR=${lifnr}`;
  //   window.open(URL);
  // };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Vendor Stock"></CardHeader>
      <LoadingFetchData active={overlayLoading} />
      <CardBody>
        {/* Filter */}
        <Form>
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
                      placeholder="Depo Name"
                      value={user.vendor_name}
                      disabled
                    />
                  </Col>
                </Form.Group>
              )}
              {user.vendor_code === null && (
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    <b>Vendor Code</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Vendor Code"
                      onChange={(e) => {
                        setLifnr(e.target.value);
                      }}
                      value={lifnr}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>
              )}
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Material Number</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Material Number"
                    onChange={(e) => {
                      setMatnr(e.target.value);
                    }}
                    value={matnr}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Form.Group>
            </Col>
            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Material Description</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Material Description"
                    onChange={(e) => {
                      setWerks(e.target.value);
                    }}
                    value={werks}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={6}>
                  {user.purch_org !== null && (
                    <Form.Group as={Row} className="mt-3">
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
                    <Form.Group as={Row} className="mt-3">
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
                </Col>
              </Form.Group>
            </Col>
          </Form.Group>
        </Form>

        {/* Table */}
        {data && data.length > 0 && (
          <VendorStockTable
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
