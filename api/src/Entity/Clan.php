<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClanRepository::class)]
#[ApiResource]
class Clan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(options: ['default' => 1])]
    private ?int $points = null;

    #[ORM\OneToMany(mappedBy: 'clan', targetEntity: User::class)]
    private Collection $users;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $banner = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $emblem = null;

    #[ORM\OneToMany(mappedBy: 'clan', targetEntity: MembersClan::class, orphanRemoval: true)]
    private Collection $membersClans;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->points = 0;
        $this->membersClans = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPoints(): ?int
    {
        return $this->points;
    }

    public function setPoints(int $points): self
    {
        $this->points = $points;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setClan($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getClan() === $this) {
                $user->setClan(null);
            }
        }

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(string $banner): self
    {
        $this->banner = $banner;

        return $this;
    }

    public function getEmblem(): ?string
    {
        return $this->emblem;
    }

    public function setEmblem(string $emblem): self
    {
        $this->emblem = $emblem;

        return $this;
    }

    /**
     * @return Collection<int, MembersClan>
     */
    public function getMembersClans(): Collection
    {
        return $this->membersClans;
    }

    public function addMembersClan(MembersClan $membersClan): self
    {
        if (!$this->membersClans->contains($membersClan)) {
            $this->membersClans->add($membersClan);
            $membersClan->setClan($this);
        }

        return $this;
    }

    public function removeMembersClan(MembersClan $membersClan): self
    {
        if ($this->membersClans->removeElement($membersClan)) {
            // set the owning side to null (unless already changed)
            if ($membersClan->getClan() === $this) {
                $membersClan->setClan(null);
            }
        }

        return $this;
    }
}
