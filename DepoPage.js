import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { DepoTable } from "./DepoTable";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectDepo,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchDepo,
} from "./depoSlice";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";
import { showErrorDialog } from "../../../utility";
import LoadingFetchData from "../../../utility/LoadingFetchData";

export const DepoPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectDepo);
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Filter
  const [vendorCode, setVendorCode] = useState("");
  const [region, setRegion] = useState("");
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
      region: region,
      purch_org: filterPurOrg, //valueNmbr, //parameter pembacaan u/ melakukan permintaan API
      pageNo: 1,
      pageSize: 10,
    };
    try {
      const response = await dispatch(fetchDepo(params));
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
        vendor_code: filterVendorCode,
        region: region,
        purch_org: filterPurOrg, //valueNmbr,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchDepo(params));
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

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Depo">
        {user.vendor_code !== null && (
          <CardHeaderToolbar>
            <Button
              className="btn btn-danger"
              onClick={() => history.push("/masterdata/depo/master/create")}
            >
              Create
            </Button>
          </CardHeaderToolbar>
        )}
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
            </Col>

            {/* Right Row */}
            <Col sm={6}>
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
              {user.purch_org === null && (
                <Form.Group as={Row} className="mt-5">
                  <Form.Label column sm={3}>
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
        </Form>

        {/* Table */}
        {data && data.length > 0 && (
          <DepoTable
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
