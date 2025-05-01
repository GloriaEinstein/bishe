export const successResponse = (res, data, message = '成功') => {
    res.json({ 
      code: 200, 
      success: true, 
      message, 
      data: { ...data, password: undefined } 
    })
  }
  
  export const errorResponse = (res, code, message) => {
    res.status(code).json({ 
      code, 
      success: false, 
      message 
    })
  }