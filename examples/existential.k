x = 10

// we have a typeof shortcut in the form of ??
throw "123" if x??

// also a not null check in the form of ?
ok(false) if x?

// the soak operator ?. is useful for soaking up nulls
if person?.address
  sendMail()

// it can also be chained and caches function calls
if person?.boss?.address
  if person.friend()?.age > 18
    person.sendMail()