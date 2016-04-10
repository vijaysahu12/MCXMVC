Create Table Services(
	ServicesID bigint not null Identity(1,1) Primary Key,
	CustomerID bigint not null,
	ServiceType int not null,
	StartDate datetime not null,
	EndDate datetime not null,
	IsActive bit, 
	CreatedDate Datetime not null,
	Foreign Key (CustomerID) References Customers(CustomerID),
	--Foreign Key (ServiceType) References 
)


