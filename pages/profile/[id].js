import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfile, getPublications } from "../../api"
import Image from "next/image"
import { ethers } from "ethers"

import ABI from "../../abi.json"
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"


export default function Profile() {
    const router = useRouter()
    const id = router.query.id
    
    const [profile, setProfile] = useState([])
    const [publications, setPublications] = useState([])
    const [account, setAccount] = useState('')
    
    useEffect(() => {
        if (id) {
            fetchProfile()
        }
    }, [id])

    async function fetchProfile() {
        try {
            const profileData = await client.query(getProfile, { id }).toPromise()
            setProfile(profileData.data.profile)

            const publicationsData = await client.query(getPublications, { id, limit: 25 }).toPromise()
            setPublications(publicationsData.data.publications.items)

        } catch(err) {
            console.log(err)
        }
    }

    async function connect() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        setAccount(accounts[0])
    }

    function getSigner() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        return provider.getSigner();
      }

    async function followUser() {
        const contract = new ethers.Contract(
            address,
            ABI,
            getSigner()
        )

        try {
            const tx = await contract.follow([id], [0x0])
            await tx.wait()
            console.log("followed user successfully")
            console.log(tx)

        } catch(err) {
            console.log(err)
        }
    }


    return (
        <div>
            {
                (profile.picture !== null && profile.picture !== undefined) ? 
                
                (<Image
                    src={profile.picture.original.url}
                    width="120px"
                    height="120px"
                />) 
                : 
                (<div style={{width:'120px', height:'120px'}}/>)
            }
            <h4>{profile.name} <span style={{color:'grey', fontStyle:'italic'}}>@{profile.handle}</span></h4>
            {
                account ? account : <button onClick={connect}>Connect</button>
            }
            <button onClick={followUser}>Follow</button>
            <p>{profile.bio}</p>
            
            {
                publications.map((publication, index) => (
                    <div key={index} style={{padding: "15px", margin: "15px", backgroundColor: "#EDFCF2", border: "1px solid #A8F0C0"}}>
                        <p>{publication.metadata.description}</p>
                    </div>
                ))
            }

        </div>
    )

}