import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_HOST } from '@/Utils/constant';
import axios from 'axios';
import { Mail, Phone, GraduationCap, Briefcase, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { FcOrganization } from "react-icons/fc";
import { Building } from "lucide-react";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {userId} =  useParams() 

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${BACKEND_HOST}/api/user/user/${userId}`);
            setUser(response.data.user);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">User not found</div>;
    }

    return (
        <div className="container md:ml-30 mt-20">
            <Card className="max-w-3xl">
                <CardHeader className="flex  items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center flex flex-col">
                        <h1 className="text-2xl font-bold lowercase">@{user.username}</h1>
                        <Badge variant="secondary" className="mt-2 px-10 py-2">
                            {user.role}
                        </Badge>
                    </div>
                </CardHeader>
                    <div className="w-[100%] h-[1px] border"></div>
                <CardContent className="grid gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="p-2 border">

                            <Mail className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 border">

                            <Phone className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 border">
                            <GraduationCap className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50">{user.university} ({user.graduationYear})</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 border">
                            <Briefcase className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50 max-w-[100%]">{user.field}</span>
                        </div>
                         <div className="flex items-center gap-4 truncate">
                            <div className="p-2 border">
                            <Building className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50 max-w-[100%]">{user.company.slice(0,43)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 border">

                            <Calendar className=" text-muted-foreground icon size={5}  " />
                            </div>
                            <span className="text-foreground/50">Member since {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="w-[107%] ml-[-3.5%] h-[1px] border"></div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                    <Button className={"w-[200px] h-11 uppercase text-sm cursor-pointer"}>Contact</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UserProfile;