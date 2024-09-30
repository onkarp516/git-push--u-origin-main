import React, { useEffect, useState } from 'react';

import { Form, Modal, Button } from 'react-bootstrap';

import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue, Select } from 'react-select';
import GridTable from '@nadavshaar/react-grid-table';

const CustomModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal d-block' : 'modal d-none';
};

interface Option {
  readonly label: string;
  readonly value: string;
}

interface State {
  readonly isLoading: boolean;
  readonly options: readonly Option[];
  readonly value: Option | null | undefined;
}

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('One'),
  createOption('Two'),
  createOption('Three'),
];
export default class CreatableAdvanced extends Component {
  // state: State = {
  //   isLoading: false,
  //   options: defaultOptions,
  //   value: undefined,
  // };
  handleChange = (newValue, actionMeta) => {
    // console.group("Value Changed");
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    // this.setState({ value: newValue });
    // setValue(newValue);
    props.setFieldValue('doc_name', newValue);
  };
  // const handleCreate = (inputValue) => {
  handleCreate = (inputValue) => {
    this.setState({ isLoading: true });
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
    }, 1000);
  };
  render() {
    const { isLoading, options, value } = this.state;
    return (
      <div className=''>
        1
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={this.handleChange}
        onCreateOption={this.handleCreate}
        options={options}
        value={value}
      />
      </div>
    );
  }
}

// const Username = ({
//   tableManager,
//   value,
//   field,
//   data,
//   column,
//   colIndex,
//   rowIndex,
// }) => {
//   return (
//     <div
//       className="rgt-cell-inner"
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         overflow: 'hidden',
//         minHeight: '30px',
//       }}
//     >
//       {/* <img src={data.avatar} alt="user avatar" /> */}
//       <span className="rgt-text-truncate" style={{ marginLeft: 10 }}>
//         {value}
//       </span>
//     </div>
//   );
// };

// const rows = [
//   {
//     id: 1,
//     username: 'wotham0',
//     gender: 'Male',
//     last_visited: '12/08/2019',
//     test: { x: 1, y: 2 },
//     avatar: 'https://robohash.org/atquenihillaboriosam.bmp?size=32x32&set=set1',
//   },
//   {
//     id: 2,
//     username: 'dbraddon2',
//     gender: 'Female',
//     last_visited: '16/07/2018',
//     test: { x: 3, y: 4 },
//     avatar: 'https://robohash.org/etsedex.bmp?size=32x32&set=set1',
//   },
//   {
//     id: 3,
//     username: 'dridett3',
//     gender: 'Male',
//     last_visited: '20/11/2016',
//     test: { x: 5, y: 8 },
//     avatar: 'https://robohash.org/inimpeditquam.bmp?size=32x32&set=set1',
//   },
//   {
//     id: 4,
//     username: 'gdefty6',
//     gender: 'Female',
//     last_visited: '03/08/2019',
//     test: { x: 7, y: 4 },
//     avatar: 'https://robohash.org/nobisducimussaepe.bmp?size=32x32&set=set1',
//   },
//   {
//     id: 5,
//     username: 'hbeyer9',
//     gender: 'Male',
//     last_visited: '10/10/2016',
//     test: { x: 2, y: 2 },
//     avatar: 'https://robohash.org/etconsequatureaque.jpg?size=32x32&set=set1',
//   },
// ];

// const columns = [
//   {
//     id: 1,
//     field: 'username',
//     label: 'Username',
//     cellRenderer: Username,
//   },
//   {
//     id: 2,
//     field: 'gender',
//     label: 'Gender',
//   },
//   {
//     id: 3,
//     field: 'last_visited',
//     label: 'Last Visited',
//     sort: ({ a, b, isAscending }) => {
//       let aa = a.split('/').reverse().join(),
//         bb = b.split('/').reverse().join();
//       return aa < bb
//         ? isAscending
//           ? -1
//           : 1
//         : aa > bb
//         ? isAscending
//           ? 1
//           : -1
//         : 0;
//     },
//   },
//   {
//     id: 4,
//     field: 'test',
//     label: 'Score',
//     getValue: ({ value, column }) => value.x + value.y,
//   },
// ];
// class DataTableEx extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div className="">
//         <div className="">
//           <GridTable
//             columns={columns}
//             rows={rows}
//             headerHeight="37px"
//             selectAllMode={'all'}
//             isPaginated={false}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default DataTableEx;
