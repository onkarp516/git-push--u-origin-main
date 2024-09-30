import React, { Component } from 'react'
import { Table, Row, Col, Button } from 'react-bootstrap'

import { MyDatePicker, eventBus } from '@/helpers'

export default class ProfitAndLoss1 extends Component {
    render() {
        return (
            <div className='report-form-style'>
                <div className='p-3'>
                    <Table bordered hover responsive>
                        <thead>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>COMPANY NAME</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>Profit & Loss A/c</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>Group Name (Sales Accounts)</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} >
                                    <div className='justify-content-center d-flex'>

                                        PERIOD :
                                        <MyDatePicker
                                            name="applicable_date"
                                            placeholderText="DD/MM/YYYY"
                                            id="applicable_date"
                                            dateFormat="dd/MM/yyyy"
                                            // onChange={(date) => {
                                            //     setFieldValue("applicable_date", date);
                                            // }}
                                            // selected={values.applicable_date}
                                            maxDate={new Date()}
                                            className="report-date-style"
                                        />
                                        TO
                                        <MyDatePicker
                                            name="applicable_date"
                                            placeholderText="DD/MM/YYYY"
                                            id="applicable_date"
                                            dateFormat="dd/MM/yyyy"
                                            // onChange={(date) => {
                                            //     setFieldValue("applicable_date", date);
                                            // }}
                                            // selected={values.applicable_date}
                                            maxDate={new Date()}
                                            className="report-date-style"
                                        />
                                    </div>
                                </th>
                            </tr>
                            <tr className='border-dark'>
                                <td></td>
                                <th colSpan={2} className='text-center'>Closing Balance</th>
                            </tr>
                            <tr className='border-dark'>
                                <th className='text-center'>PARTICULARS</th>
                                <th className='text-center'>Debit A/c</th>
                                <th className='text-center'>Credit A/c</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className='border-dark'>
                                <td onClick={(e) => {
                                    e.preventDefault();
                                    eventBus.dispatch("page_change", "profitandloss2");
                                }}>Gst sales @18%</td>
                                <td className='text-center'>XXX</td>
                                <td className='text-center'>XXX</td>
                            </tr>

                        </tbody>
                        <tfoot>
                            <tr className='border-dark'>
                                <th className='text-center'>TOTAL</th>
                                <th className='text-center'>XXX</th>
                                <th className='text-center'>XXX</th>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        )
    }
}
