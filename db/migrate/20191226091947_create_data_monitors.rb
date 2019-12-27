class CreateDataMonitors < ActiveRecord::Migration[5.2]
  def change
    create_table :data_monitors do |t|
      t.string :tag_name
      t.string :source
      t.string :datatype

      t.timestamps
    end
  end
end
