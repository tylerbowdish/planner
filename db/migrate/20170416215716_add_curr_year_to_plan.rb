class AddCurrYearToPlan < ActiveRecord::Migration[5.0]
  def change
    add_column :plans, :currYear, :integer
  end
end
