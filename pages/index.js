import { useState, useEffect } from "react"
import {client, recommendedProfiles} from "../api"
import Link from "next/link"
import Image from "next/image"


export default function Home() {
  
  const [profiles, setProfiles] = useState([])
  
  useEffect(() => {fetchProfiles(), []})

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendedProfiles).toPromise()
      console.log(response)
      setProfiles(response.data.recommendedProfiles)
    } catch (err) {
      console.log(err)
    }
  }

  function validateIpfsImageUrl(url, validIpfsUrl='lens.infura-ipfs.io') {
    return url.toString().includes(validIpfsUrl);
  }
  
  return (
    <div>
      {
        profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key={index}>
            <a>
              <div>
                {
                  (
                    profile.picture !== null
                    && profile.picture.original !== undefined 
                    && validateIpfsImageUrl(profile.picture.original.url)
                    ) ? (
                    <Image 
                    src={profile.picture.original.url}
                    width="120px"
                    height="120px"  
                  />
                  ) : (
                    <div
                      style={{width:'120px', height:'120px', backgroundColor:'black'}}
                    />
                  )
                }
                <h4>{profile.handle}</h4>
                <p>{profile.bio}</p>
              </div>
            </a>
          </Link>
        ))
      }
    </div>
  )
}
