using System.Drawing;

namespace ToDoListApplication.Models
{
    public class Label
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Color Color { get; set; }

        public Label() { }

        public Label(string name, Color color)
        {
            this.Name = name;
            this.Color = Color;
        }
    }
}