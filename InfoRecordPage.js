import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../_metronic/_partials/controls";

import LoadingFetchData from "../../../utility/LoadingFetchData";
import { InfoRecordTable } from "./InfoRecordTable";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectInfoRecord,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchInfoRecord,
} from "./infoRecordSlice";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { selectUser } from "../../../modules/Auth/_redux/authRedux";

export const InfoRecordPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectInfoRecord);
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [infoRecord, setInfoRecord] = useState("");
  const [materialDesc, setMaterialDesc] = useState("");
  const [material, setMaterial] = useState("");
  const [vendorCode, setVendorCode] = useState("");
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
      start_date: startDate,
      end_date: endDate,
      LIFNR: filterVendorCode,
      INFNR: infoRecord,
      MATNR: material,
      material_description: materialDesc,
      purch_org: filterPurOrg, //valueNmbr, //parameter pembacaan u/ melakukan permintaan API
      pageNo: 1,
      pageSize: 10,
    };

    //--Validasi
    if (startDate && endDate === "") {
      return showErrorDialog("Please Select End Date ");
    }
    if (endDate && startDate === "") {
      return showErrorDialog("Please Select Start Date");
    }
    //--

    try {
      const response = await dispatch(fetchInfoRecord(params));
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
        start_date: startDate,
        end_date: endDate,
        LIFNR: filterVendorCode,
        INFNR: infoRecord,
        MATNR: material,
        material_description: materialDesc,
        purch_org: filterPurOrg, //valueNmbr,
        pageNo: page,
        pageSize: sizePerPage,
      };
      try {
        const response = await dispatch(fetchInfoRecord(params));
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
      <CardHeader title="Price List"></CardHeader>
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
                  <b>Price List</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Price List"
                    value={infoRecord}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setInfoRecord(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Material </b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Material"
                    value={material}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Material Description</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Material Description"
                    value={materialDesc}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setMaterialDesc(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Created Date</b>
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="date"
                    placeholder="Valid From"
                    sm={6}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Col>
                <b className="mt-3">To</b>
                <Col sm={4}>
                  <Form.Control
                    type="date"
                    placeholder="Valid To"
                    sm={6}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
          <InfoRecordTable
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
