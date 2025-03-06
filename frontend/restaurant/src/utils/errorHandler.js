import { useToast } from 'vue-toastification';



// Error handler
// =================================================================

const toast = useToast();

export const errorHandler = (error, msg) => {
	let errMsg;

	if (error.response && error.response.data && error.response.data.message)
		errMsg = error.response.data.message;
	else
		errMsg = error.message;

  	console.error(msg + ":", errMsg);
  	toast.error(errMsg);
};
