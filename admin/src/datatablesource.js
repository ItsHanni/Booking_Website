export const userColumns = [
  { 
    field: "_id", 
    headerName: "ID", 
    width: 150 
  },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img 
            className="cellImg" 
            src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} 
            alt="avatar" 
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "role",
    headerName: "Role",
    width: 230,
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150, 
  },
];


export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
  {
    field: "address",
    headerName: "Address",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];

export const bookingColumns = [
  { field: "_id", headerName: "ID", width: 200 },
  {
    field: "checkInDate",
    headerName: "Check In",
    width: 200,
    renderCell: (params) => {
      const date = new Date(params.row.checkInDate);
      return date.toISOString().split('T')[0];
    },
  },
  {
    field: "checkOutDate",
    headerName: "Check Out",
    width: 200,
    renderCell: (params) => {
      const date = new Date(params.row.checkOutDate);
      return date.toISOString().split('T')[0];
    },
  },
  {
    field: "roomNumber",
    headerName: "Room Number",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
  },
];
