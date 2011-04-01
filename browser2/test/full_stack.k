#arrow implicit_brackets bang implicit_return at string_interpolation multiline_strings extend_for

exports.testAddEdge = -> (is) {
  client.select 15
  client.FLUSHDB()
  
  u = User.create! {id: "jonah"}
  p = Puzzle.create! {id: 2}
  
  err, data = User.client.get! "User:jonah:love:n"
  is.equal data, null
  
  ok = u.link! p.id, "love"
  is.ok ok
  err, data = User.client.sismember! "User:jonah:love","2"
  is.equal data, 1
  
  err, data = User.client.get! "User:jonah:love:n"
  is.equal data, "1"
  
  yield
}


/*

exports.testAddEdge = function(is, done) {
  client.select(15)
  client.FLUSHDB()
  User.create({id: "jonah"}, function(u) {
    
    Puzzle.create({id: 2}, function(p) {

      User.client.get("User:jonah:love:n", function(err, data) {
        is.equal(data, null)
        u.link(p.id, "love", function(ok) {
          is.ok(ok)
          
          //logKeys()
          User.client.sismember("User:jonah:love","2", function(err, data) {
            is.equal(data, 1)
          })

          User.client.get("User:jonah:love:n", function(err, data) {
            is.equal(data, "1")
            done()
          })
        })
      })
    })
  })
}

*/