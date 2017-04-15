class UserLoginField < ActiveRecord::Migration[5.0]
  def change
  	add_column :users, :login, :string
  end
end
