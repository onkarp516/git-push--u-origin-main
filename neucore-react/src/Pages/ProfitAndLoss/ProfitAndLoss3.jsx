import React, { Component } from 'react'
import { Table, Row, Col, Button } from 'react-bootstrap'

import { MyDatePicker, eventBus } from '@/helpers'

export default class ProfitBalance extends Component {
    render() {
        return (
            <div className='report-form-style'>
                <div className='p-3'>
                    <Table bordered hover responsive>
                        <thead>
                            <tr className='border-dark'>
                                <th colSpan={6} className='text-center'><h3>COMPANY NAME</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={6} className='text-center'><h3>Profit & Loss A/c</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={6} className='text-center'><h3>Ledger Name : Ledger Name</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={6} >
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
                                <th className='text-center'>Date</th>
                                <th className='text-center'>Invoice No.</th>
                                <th className='text-center'>Particulars</th>
                                <th className='text-center'>Voucher Type</th>
                                <th className='text-center'>Debit</th>
                                <th className='text-center'>Credit</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className='border-dark'>
                                <td className='text-center'>01/04/2022</td>
                                <td className='text-center'>124</td>
                                <td>Cash A/c</td>
                                <td className='text-center'>sales</td>
                                <td></td>
                                <td>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td className='text-center'>01/04/2022</td>
                                <td className='text-center'>125</td>
                                <td>Cash A/c</td>
                                <td className='text-center'>sales</td>
                                <td></td>
                                <td>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td className='text-center'></td>
                                <td className='text-center'></td>
                                <td>Opening Balance</td>
                                <td className='text-center'></td>
                                <td>XXX</td>
                                <td></td>
                            </tr>
                            <tr className='border-dark'>
                                <td className='text-center'></td>
                                <td className='text-center'></td>
                                <td>Total Amount</td>
                                <td className='text-center'></td>
                                <td></td>
                                <td>XXX</td>
                            </tr>
                            <tr className='border-dark'>
                                <td className='text-center'></td>
                                <td className='text-center'></td>
                                <td>Closing Balance</td>
                                <td className='text-center'></td>
                                <td></td>
                                <td>XXX</td>
                            </tr>

                        </tbody>
                        {/* <tfoot>
                            <tr className='border-dark'>
                                <th className='text-center'>TOTAL</th>
                                <th className='text-center'>0</th>
                                <th className='text-center'>400</th>
                                <th className='text-center'>1400</th>
                            </tr>
                        </tfoot> */}
                    </Table>
                </div>
            </div>
        )
    }
}
