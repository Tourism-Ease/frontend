import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface RoomType {
  id: number;
  name: string;
  price: number;
}

export function RoomTypesSection() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addRoomType = () => {
    if (!name || !price) return;

    setRoomTypes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        price: parseFloat(price),
      },
    ]);

    setName("");
    setPrice("");
  };

  const removeRoomType = (id: number) => {
    setRoomTypes((prev) => prev.filter((room) => room.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Room Types</h2>

      {/* Inputs */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Room type name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[200px]"
        />
        <Input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-[150px]"
        />
        <Button onClick={addRoomType}>Add</Button>
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4">
        {roomTypes.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader className="font-semibold">{room.name}</CardHeader>
            <CardContent className="text-muted-foreground">
              Price: ${room.price}
            </CardContent>

            <Button
              size="icon"
              variant="destructive"
              className="absolute top-3 right-3"
              onClick={() => removeRoomType(room.id)}
            >
              <Trash2 size={16} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
