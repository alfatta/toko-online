const error = (code, message) => ({ code, message })

const db = global.db

module.exports.getAll = (table, options, callback) => {
  console.log('OPTIONS : ' + JSON.stringify(options));
  
  const {filter, paginate, sort, groupBy, baseQuery} = options
  
  let query = 'SELECT * FROM ??'
  query = db.format(query, [table])

  if (baseQuery) {
    query = baseQuery
  }

  query += ` WHERE ${table}.deleted_at IS NULL`

  if (filter && filter.name) {
    query += " AND name LIKE ?"
    query = db.format(query, ['%' + filter.nama + '%'])
  }

  if (filter && filter.by) {
    query += ` AND ${filter.by.key} = ?`
    query = db.format(query, [filter.by.value])
  }

  if (groupBy) {
    query += ` GROUP BY ${groupBy}`
  }

  if (sort && sort.by) {
    query += " ORDER BY ?? " + (sort.order ? 'DESC' : 'ASC')
    query = db.format(query, [sort.by, db.escape(sort.order)])
  }

  if (paginate && paginate.page && paginate.perpage) {
    const {page, perpage} = paginate
    query += " LIMIT ?, ?"
    query = db.format(query, [(page - 1) * perpage, perpage])
  }

  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      console.log('RESULT : ' + JSON.stringify(result))
      callback(null, result)
    }
  })
}

module.exports.getById = (table, id, callback, force = false) => {
  let sql = 'SELECT * FROM ?? WHERE id = ?'

  if (!force) {
    sql += ' AND deleted_at IS NULL'
  }

  const query = db.format(sql, [table, id])

  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      console.log('RESULT : ' + JSON.stringify(result))
      if (result.length > 0) {
        callback(null, result[0])
      } else {
        console.log('INFO : Data not found');
        callback(error(404, 'Data not found'), null)
      }
    }
  })
}

module.exports.getByIdForce = (...params) => this.getById(...params, true)

module.exports.insert = (table, data, callback) => {
  const sql = 'INSERT INTO ?? SET ?'

  const query = db.format(sql, [table, data])

  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      console.log('RESULT : ' + JSON.stringify(result))
      callback(null, result)
    }
  })
}

module.exports.insertMany = (table, column, data, callback) => {
  const sql = `INSERT INTO ?? ${column} VALUES ?`

  const query = db.format(sql, [table, data])

  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      console.log('RESULT : ' + JSON.stringify(result))
      callback(null, result)
    }
  })
}

module.exports.update = (table, data, id, callback) => {
  if (Object.keys(data).length < 1) {
    return callback(error(500, 'Missing property'), null)
  }

  const sql = 'UPDATE ?? SET ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL'

  const query = db.format(sql, [table, data, id])

  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      if (result.affectedRows) {
        console.log('RESULT : ' + JSON.stringify(result))
        callback(null, result)
      } else {
        console.log('INFO : Data not found');
        callback(error(404, 'Data not found'), null)
      }
    }
  })
}

module.exports.delete = (table, id, callback) => {
  const sql = 'UPDATE ?? SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL'
  
  const query = db.format(sql, [table, id])
  
  console.log('SQL : ' + query);
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('ERROR : ' + err.message);
      callback(error(500, err.message), null)
    } else {
      if (result.affectedRows) {
        console.log('RESULT : ' + JSON.stringify(result))
        callback(null, result)
      } else {
        console.log('INFO : Data not found');
        callback(error(404, 'Data not found'), null)
      }
    }
  })
}