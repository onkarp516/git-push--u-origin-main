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
                                <th colSpan={4} className='text-center'><h3>COMPANY NAME</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>Profit & Loss A/c</h3> </th>
                            </tr>
                            <tr className='border-dark'>
                                <th colSpan={4} className='text-center'><h3>LEDGER NAME</h3> </th>
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
                                <th></th>
                                <th colSpan={2} className='text-center'>Transactions</th>
                                <th></th>
                            </tr>
                            <tr className='border-dark'>
                                <th className='text-center'>Particulars</th>
                                <th className='text-center'>Debit</th>
                                <th className='text-center'>Credit</th>
                                <th className='text-center'>Closing Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className='border-dark'>
                                <td>Opening balance</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td onClick={(e) => {
                                    e.preventDefault();
                                    eventBus.dispatch("page_change", "profitandloss3");
                                }}>April</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>May</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>June</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>Jule</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>August</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>September</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>October</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>November</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>December</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>January</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>February</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                            <tr className='border-dark'>
                                <td>March</td>
                                <td className='text-center'></td>
                                <td className='text-center'>0</td>
                                <td className='text-center'>1000</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className='border-dark'>
                                <th className='text-center'>TOTAL</th>
                                <th className='text-center'>0</th>
                                <th className='text-center'>400</th>
                                <th className='text-center'>1400</th>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        )
    }
}
