# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user1 = User.new
user1.login = "joe"
user1.email = "joe@cedarville.edu"
user1.password = "password"
user1.password_confirmation = "password"
user1.save!

user2 = User.new
user2.login = "pete"
user2.email = "pete@cedarville.edu"
user2.password = "password"
user2.password_confirmation = "password"
user2.save!

#give joe a couple of plans
Plan.create(user_id: user1.id, name: "Plan1")
Plan.create(user_id: user1.id, name: "Plan2")

course1 = Course.new
course1.number = "1234"
course1.name = "newcourse"
course1.description = "blah blah blah"
course1.credits = 5
course1.save!

Course.create(number: "CS-1210", name: "C++ Programming", description: "This course is SO easy!", credits: 2)
Course.create(number: "AB-1234", name: "Test course", description: "Arbitrary description", credits: 3)
