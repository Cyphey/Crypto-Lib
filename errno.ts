export enum errorCodes {
	EXIT_SUCCESS = 0,	// Successful
	EXIT_FAILURE,		// Failure
	EPERM,				// Operation not permitted
	ESRCH,				// No such process
	EIO,				// Error I/O
	E2BIG,				// Arguement list too long
	EAGAIN,				// Try Again
	EBUSY,				// Resource Busy
	EINVAL,				// Invalid Arguement
	EDOM,				// Math arguement out of domain of function
	ERANGE,				// Math result not representable
	ENOSYS,				// Function not implemented
	ENOMSG,				// No message of desired type
	EIDRM,				// Identifier removed
	ECHRNG,				// Channel number out of range
	EBADE,				// Invalid exchange
	EBADR,				// Invalid request descriptor
	EXFULL,				// Exchange full
	EBADRQC,			// Invalid request code
	EBADSLT,			// Inavlid slot
	ENODATA,			// No data available
	ETIME,				// Timer expired
	ECOMM,				// Communication error on send
	EBADMSG,			// Not a data message
	EUSERS,				// Too many users
	EMSGSIZE,			// Message too long
	EKEYEXISTS,			// Key already exists
	EKEYEXPIRED,		// Key has expired
	EKEYREVOKED,		// Key has been revoked
	EKEYDEPRECATED		// Key has been deprecated
};