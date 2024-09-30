import React, { Component } from 'react'
import {
    Button,
    Col,
    Row,
    Form,
    Table,
    InputGroup,
    Collapse,
    FormControl,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";


import { MyDatePicker, eventBus } from '@/helpers'
import { getProfitLossDetails } from '@/services/api_functions';


export default class ProfitBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initVal: {
                startDate: "",
                endDate: "",

            },
            BalanceDetails: [],
            bDetails: "",
        };
    }

    lstBalanceDetails = (startDate, endDate) => {
        // console.log(startDate, endDate);
        let requestData = new FormData();
        if (startDate != null) {
            requestData.append("startDate", moment(startDate).format("yyyy-MM-DD"));

        }
        if (endDate != null) {
            requestData.append("endDate", moment(endDate).format("yyyy-MM-DD"));
        } getProfitLossDetails(requestData)
            .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                    let d = res.responseObject;
                    if (d.length > 0) {
                        this.setState({ bDetails: d });
                    }
                }
            })
            .catch((error) => {
                this.setState({ data: [] });
                console.log("error", error);
            });
    };


    render() {
        const { bDetails, initVal } = this.state;
        return (
            <div className='report-form-style'>
                <div className='p-3'>
                    <Table bordered hover responsive>
                        <thead>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>COMPANY NAME</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} >
                                    {/* <div className='justify-content-center d-flex'>
                                        <div className="">
                                            <div className="wrapper_div"> */}
                                    {/* <div className="main-div mb-2 m-0 company-from"> */}
                                    <Formik
                                        validateOnChange={false}
                                        // validateOnBlur={false}
                                        enableReinitialize={true}
                                        initialValues={initVal}
                                        innerRef={this.searchRef}
                                        validationSchema={Yup.object().shape({
                                            // branchId: Yup.object()
                                            //   .required("Branch is required")
                                            //   .nullable(),
                                            // standardId: Yup.object()
                                            //   .required("standard is required")
                                            //   .nullable(),
                                        })}
                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            console.log("value", values);

                                        }}
                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleSubmit,
                                            isSubmitting,
                                            resetForm,
                                            setFieldValue,
                                        }) => (
                                            <Form className="form-style">
                                                <div className="mb-2 m-0 company-from">
                                                    PERIOD :
                                                    <MyDatePicker
                                                        name="startDate"
                                                        placeholderText="DD/MM/YYYY"
                                                        id="startDate"
                                                        dateFormat="dd/MM/yyyy"
                                                        onChange={(v) => {

                                                            setFieldValue("startDate", v);
                                                        }}
                                                        selected={values.startDate}
                                                        maxDate={new Date()}
                                                        className="report-date-style"
                                                    />
                                                    TO
                                                    <MyDatePicker
                                                        name="endDate"
                                                        placeholderText="DD/MM/YYYY"
                                                        id="endDate"
                                                        dateFormat="dd/MM/yyyy"
                                                        onChange={(v) => {

                                                            if (v != null) {

                                                                setFieldValue("endDate", v);
                                                                this.lstBalanceDetails(values.startDate, v);
                                                            }

                                                        }}
                                                        selected={values.endDate}
                                                        maxDate={new Date()}
                                                        className="report-date-style"
                                                    />
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    {/* </div> */}
                                    {/* </div>
                                        </div>
                                    </div> */}


                                </th>
                            </tr>
                            <tr className='border-dark'>
                                <th> Dr.</th>
                                <td></td>
                                <td></td>
                                <th>Cr.</th>
                            </tr>
                            <tr className='border-dark'>
                                <th className='text-center'>PARTICULARS</th>
                                <th className='text-center'>Amount(INR)</th>
                                <th className='text-center'>PARTICULARS</th>
                                <th className='text-center'>Amount(INR)</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className='border-dark' onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "profitandloss1");
                            }}>
                                <td>Opening Stock</td>
                                <td className='text-center'>XXX</td>
                                <td>Sales Accounts</td>
                                <td className='text-center'>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Opening Stock</td>
                                <td className='text-center'>XXX</td>
                                <td>Sales Accounts</td>
                                <td className='text-center'>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Direct Expenses</td>
                                <td className='text-center'>XXX</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Gross Profit c/f</td>
                                <td className='text-center'>XXXX</td>
                                <td>Gross Loss c/f</td>
                                <td className='text-center'>XXXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <th>TOTAL</th>
                                <th className='text-center'>XXXXX</th>
                                <th>TOTAL</th>
                                <th className='text-center'>XXXXX</th>
                            </tr>
                            <tr className='border-dark'>
                                <td>Gross Loss b/f</td>
                                <td className='text-center'>XXXX</td>
                                <td>Gross Profit b/f</td>
                                <td className='text-center'>XXXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Indirect Expenses</td>
                                <td className='text-center'>XXX</td>
                                <td>Indirect Income</td>
                                <td className='text-center'>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Net Profit</td>
                                <td className='text-center'>XXX</td>
                                <td>Net Loss</td>
                                <td className='text-center'>XXX</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className='border-dark'>
                                <th className='text-center'>TOTAL</th>
                                <th className='text-center'>XXX</th>
                                <th className='text-center'>TOTAL</th>
                                <th className='text-center'>XXX</th>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        )
    }
}
