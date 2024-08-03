const asyncHandler = (requesrHandler) => {
  return (req, res, next) => {
    Promise.resolve(requesrHandler(req,res,next)).catch(err => next(err));
  };
};
export { asyncHandler}
//Try Catchj Method

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
//   ;
// };
