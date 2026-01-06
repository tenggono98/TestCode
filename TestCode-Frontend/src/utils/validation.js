// cek apakah field ada value
export const required = (v) => v !== undefined && v !== null && String(v).trim() !== ''
export const minValue = (v, min) => Number(v) >= min

// validasi email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// validasi password
export const validatePassword = (password) => {
  if (!required(password)) return 'Password harus diisi'
  if (String(password).length < 6) return 'Password minimal 6 karakter'
  return null
}

// validasi jumlah
export const validateQuantity = (qty) => {
  if (!required(qty)) return 'Jumlah harus diisi'
  if (!minValue(qty, 1)) return 'Jumlah minimal 1'
  if (Number(qty) > 9999) return 'Jumlah terlalu besar'
  return null
}

// validasi login
export const validateLogin = (formData) => {
  const errors = {}
  
  if (!required(formData.email)) {
    errors.email = 'Email harus diisi'
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email tidak valid'
  }

  if (!required(formData.password)) {
    errors.password = 'Password harus diisi'
  } else if (String(formData.password).length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }

  return Object.keys(errors).length > 0 ? errors : null
}