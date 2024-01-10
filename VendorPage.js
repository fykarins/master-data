import React, { useEffect, useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../_metronic/_partials/controls";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectVendor,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchVendor,
} from "./vendorSlice";
import { VendorTable } from "./VendorTable";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";
import { showErrorDialog } from "../../../utility";
import LoadingFetchData from "../../../utility/LoadingFetchData";

export const VendorPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectVendor);
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Filter
  const [vendorName, setVendorName] = useState("");
  const [vendorCode, setVendorCode] = useState("");

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const filterVendorCode =
    user.vendor_code === null ? vendorCode : user.vendor_code;

  const handleSearch = async () => {
    const params = {
      LIFNR: filterVendorCode,
      NAME1: vendorName,
      vendorName: vendorName,
      pageNo: 1,
      pageSize: 10,
    };
    try {
      const response = await dispatch(fetchVendor(params));
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
        LIFNR: filterVendorCode,
        NAME1: vendorName,
        vendorName: vendorName,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchVendor(params));
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
      <CardHeader title="Vendor">
        {/* <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/masterdata/vendor/create")}
          >
            Create
          </Button>
        </CardHeaderToolbar> */}
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
                    <b>Vendor Code</b>
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      type="text"
                      placeholder="Vendor Code"
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
                        setVendorCode(e.target.value);
                      }}
                      value={vendorCode}
                      onKeyPress={handleKeyPress}
                    />
                  </Col>
                </Form.Group>
              )}
            </Col>

            {/* Right Row */}
            <Col sm={6}>
              {user.vendor_code === null && (
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Vendor Name</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Vendor Name"
                    onChange={(e) => {
                      setVendorName(e.target.value);
                    }}
                    value={vendorName}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
              </Form.Group>
              )}
              
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
                              setVendorCode(e.target.value); 
                            }}
                            value={vendorCode} 
                            onKeyPress={handleKeyPress}
                          />
                        </Col>
                      </Form.Group>
                  )}
                    <Button className="btn btn-danger" onClick={handleSearch}>
                      Search
                    </Button>
                  </Col>
                {/* <Col sm={3}>
                  <Button
                    className="btn btn-danger"
                    onClick={() => history.push("/masterdata/vendor-create")}
                  >
                    Create
                  </Button>
                </Col> */}
              </Form.Group>
            </Col>

          </Form.Group>
        </Form>

        {/* Table */}
        {data && data.length > 0 && (
          <VendorTable
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
