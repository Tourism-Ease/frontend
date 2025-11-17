import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import ProfileInfo from "../components/ProfileInfo";
import TripHistory from "../components/TripHistory";

export default function ProfileDashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileInfo />
        </TabsContent>

        <TabsContent value="trips" className="mt-6">
          <TripHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
