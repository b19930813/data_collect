class CreateDataTables < ActiveRecord::Migration[5.2]
  def change
    create_table :data_tables do |t|
      t.string :name
      t.string :value
      t.datetime :timestamp
      t.boolean :quality

      t.timestamps
    end
  end
end
